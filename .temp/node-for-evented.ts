namespace Opti {
  export class Evented<T extends Record<string, unknown[][]> = {}> {
    private _evmap: { [K in keyof T]?: Callbacks<T[K][number]> } = {};

    on<K extends string & keyof any, L extends unknown[]>(
      ev: K,
      callback: (...args: L) => void
    ): asserts this is EventEmitter<T & { [P in K]: K extends keyof T ? [...T[K], L] : [L] }> {
      const map = this._evmap ?? [];
      map[ev] = [...(map[ev] || []), callback] as Callbacks<any>;
    }

    off<K extends keyof T>(ev: K): asserts this is EventEmitter<Omit<T, K>> {
      delete this._evmap[ev];
    }

    emit<K extends keyof T>(ev: K, ...args: T[K][number]): void {
      const callbacks = this._evmap[ev];
      if (callbacks) {
        for (const cb of callbacks) {
          cb(...args);
        }
      }
    }
  }
}

namespace Opti.Evented {
  class ThreadTerminatedException extends globalThis.Exception {
    constructor(code?: number) {
      super("ThreadTerminatedException", code?.toString());
    }
  }

  export function addEventRuled<T extends EventTarget, K extends keyof EventMapOf<T>>(
    this: T,
    type: K,
    listener: (this: T, e: EventMapOf<T>[K]) => void,
    timesOrCondition: number | ((this: T) => boolean),
    options?: boolean | AddEventListenerOptions
  ): void {
    if (typeof timesOrCondition === "number") {
      if (timesOrCondition <= 0) return;

      let repeatCount = timesOrCondition; // Default to 1 if no repeat option provided

      const onceListener = (event: EventMapOf<T>[K]) => {
        listener.call(this, event);
        repeatCount--;

        if (repeatCount <= 0) {
          this.removeEventListener(type as string, onceListener as EventListener, options);
        }
      };

      this.addEventListener(type as string, onceListener as EventListener, options);
    } else {
      if (timesOrCondition.call(this)) return;

      const onceListener = (event: EventMapOf<T>[K]) => {
        if (timesOrCondition.call(this)) {
          this.removeEventListener(type as string, onceListener as EventListener, options);
          return;
        }
        listener.call(this, event);
      };

      this.addEventListener(type as string, onceListener as EventListener, options);
    }
  };

  export function addEventListeners<T extends EventTarget, U extends (keyof EventMapOf<T>)[]>(
    this: T,
    listenersOrTypes: U | {
      [K in keyof EventMapOf<T>]?: (this: T, e: EventMapOf<T>[K]) => any
    },
    callback?: (e: Event) => any,
    options?: AddEventListenerOptions | boolean
  ): void {
    if (Array.isArray(listenersOrTypes)) {
      for (const type of listenersOrTypes) {
        this.addEventListener(String(type), callback as EventListener, options);
      }
    } else {
      for (const [event, listener] of Object.entries(listenersOrTypes) as [keyof EventMapOf<T>, ((e: EventMapOf<T>[keyof EventMapOf<T>]) => any)][]) {
        if (listener) {
          this.addEventListener(String(event), listener as EventListener, options);
        }
      }
    }
  };

  export function delegateEventListener<
    T extends EventTarget,
    U extends Element,
    K extends keyof EventMapOf<T>
  >(
    this: T,
    type: K,
    delegator: HTMLTag | string,
    listener: (this: U, e: EventMapOf<T>[K]) => void,
    options?: boolean | AddEventListenerOptions
  ) {
    this.addEventListener(
      type as string,
      function (this: T, e: Event) {
        const target = e.target as HTMLElement | null;

        if (!target) return;

        let selector: string;
        if (typeof delegator === "string") {
          selector = delegator;
        } else {
          selector = ""; // fallback
        }

        const matchedEl = target.closest(selector) as U | null;

        if (
          matchedEl &&
          (!(this instanceof Element) || this.contains(matchedEl))
        ) {
          listener.call(matchedEl, e as EventMapOf<T>[K]);
        }
      },
      options
    );
  }

  export function addEventController<T extends EventTarget, K extends keyof EventMapOf<T>>(
    this: T,
    type: K,
    listener: (e: EventMapOf<T>[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): EventController {
    this.addEventListener(type as string, listener as EventListener, options);
    const self = this;

    const controller = new class implements EventController {
      private _exists: boolean = true;

      public exists(): this is { on(): void; off(): void; del(): void } {
        return this._exists;
      }

      on?() {
        self.addEventListener(type as string, listener as EventListener, options);
      }
      off?() {
        self.removeEventListener(type as string, listener as EventListener, options);
      }
      del?() {
        delete this.off;
        delete this.on;
        delete this.del;
        this._exists = false;
      }
    };

    return controller;
  }

  export class Thread<T, U extends ((val: T) => T)[]> {
    private _controller: AbortController;
    private _signal: AbortSignal;
    private _running: boolean;
    private _functions: U;
    private _thread: Promise<T>;
    private _terminated: boolean;
    private _sleep: number | false;

    constructor(initialValue: T, ...fn: U) {
      this._controller = new AbortController();
      this._signal = this._controller.signal;
      this._running = true;
      this._terminated = false;
      this._sleep = false;
      this._functions = fn;

      this._thread = new Promise((res, rej) => {
        if (this._signal.aborted) {
          rej();
        } else {
          res(this._functions[0](initialValue));
        }
      });
      this._functions.shift(); // Remove the function already in the queue

      for (const func of this._functions) {
        this.#then(func);
      }
    }

    sleep(ms: number): void {
      this._sleep = ms;
    }
    stack(fn: () => any): void {
      this.#then(fn);
    }
    pause(): void {
      this._running = false;
    }
    resume(): void {
      this._running = true;
    }
    terminate(code?: number): never {
      this._controller.abort();
      throw new ThreadTerminatedException(code);
    }

    get running(): boolean {
      return this._running;
    }

    #then(func: U[number]) {
      this._thread = this._thread.then(val => new Promise((resolve, reject) => {
        const waitUntilRunning = () => {
          if (this._running) {
            if (this._signal.aborted) {
              return reject();
            } else if (this._sleep) {
              setTimeout(() => {
                this._sleep = false;
                resolve(func(val));
              }, this._sleep);
            } else {
              resolve(func(val));
            }
          } else {
            setTimeout(waitUntilRunning, 50);
          }
        };

        waitUntilRunning();

        // Listen for abort signal
        this._signal.addEventListener('abort', () => reject());
      }));
    }
  }

  export class StaticThread<T, U extends ((val: T) => T)[]> extends Thread<T, U> {
    
  }
}
(function() {
  globalThis.Evented = Opti.Evented;
  globalThis.Thread = Opti.Evented.Thread;
  globalThis.StaticThread = Opti.Evented.StaticThread;

  EventTarget.prototype.addBoundListener = Opti.Evented.addEventRuled;
  EventTarget.prototype.addEventListeners = Opti.Evented.addEventListeners;
  EventTarget.prototype.delegateEventListener = Opti.Evented.delegateEventListener;
  EventTarget.prototype.addEventController = Opti.Evented.addEventController;
})();
