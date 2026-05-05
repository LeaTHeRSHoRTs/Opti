export class SetEmitter<T extends Record<string, Class[]>> {
  #eventMap: { [K in keyof T]?: ((...args: never[]) => void)[] } = {};
  #restricted: T;

  constructor(obj: T) {
    this.#restricted = obj;
  }

  on<K extends keyof T, L extends Unboxed<T[K]>>(ev: K, callback: (...args: L) => void): void {
    if (!this.#restricted[ev]) throw new Unsync.InvalidRegistrationException(`Cannot register event ${ev.toString()}, as it does not exist in the event map.`);
    const list = this.#eventMap[ev] ?? [];
    list.push(callback);
    this.#eventMap[ev] = list;
  }

  off<K extends keyof T>(ev: K): void {
    delete this.#eventMap[ev];
  }

  emit<K extends keyof T>(ev: K, ...args: Unboxed<T[K]>): void {
    const callbacks = this.#eventMap[ev];
    if (callbacks) {
      for (const cb of callbacks) {
        cb(...args);
      }
    }
  }
}

export class Emitter<T extends Record<string, unknown[]> = {}> {  
  protected _eventMap: { [K in keyof T]?: Unsync.Callbacks<T[K]> } = {};

  on<K extends string, L extends unknown[]>(
    ev: K,
    callback: (...args: L) => void
  ): asserts this is Unsync.EventEmitter<T & { [P in K]: K extends keyof T ? [...T[K], L] : [L] }> {
    this._eventMap[ev] = [...(this._eventMap[ev] || []), callback] as Unsync.Callbacks<unknown[]>;
  }

  off<K extends keyof T>(ev: K): asserts this is Unsync.EventEmitter<Omit<T, K>> {
    delete this._eventMap[ev];
  }

  emit<K extends keyof T>(ev: K, ...args: Unboxed<T[K]>): void {
    const callbacks = this._eventMap[ev];
    if (callbacks) {
      for (const cb of callbacks) {
        cb(...args);
      }
    }
  }
}

export function addConditionalListener<T extends EventTarget, K extends keyof EventMapOf<T>>(
  this: T,
  type: K,
  listener: EventTarget.Func<T, K>,
  timesOrCondition: number | ((this: T, e: EventMapOf<T>[K]) => boolean),
  options?: boolean | AddEventListenerOptions
): void {
  // eslint-disable-next-line prefer-const
  let _evFuncType = "conditional";
  // eslint-disable-next-line prefer-const
  let _evFuncData = timesOrCondition;

  if (typeof timesOrCondition === "number") {
    if (timesOrCondition <= 0) return;

    let repeatCount = timesOrCondition;

    const onceListener = (event: EventMapOf<T>[K]) => {
      listener.call(this, event);
      repeatCount--;

      if (repeatCount <= 0) {
        this.removeEventListener(type as string, onceListener as EventListener, options);
      }
    };

    this.addEventListener(type as string, onceListener as EventListener, options);
  } else {
    const onceListener = (event: EventMapOf<T>[K]) => {
      if (timesOrCondition.call(this, event)) {
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
    [K in keyof EventMapOf<T>]?: (this: T, e: EventMapOf<T>[K]) => unknown
  },
  callback?: (e: Event) => unknown,
  options?: AddEventListenerOptions | boolean
): void {
  if (Array.isArray(listenersOrTypes)) {
    for (const type of listenersOrTypes) {
      this.addEventListener(String(type), callback as EventListener, options);
    }
  } else {
    for (const [event, listener] of Object.entries(listenersOrTypes) as [keyof EventMapOf<T>, ((e: EventMapOf<T>[keyof EventMapOf<T>]) => unknown)][]) {
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
): void {
  // eslint-disable-next-line prefer-const
  let _evFuncType = "delegated";

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

      const matchedEl: U | null = target.closest(selector);

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
): Unsync.EventController {
  this.addEventListener(type as string, listener as EventListener, options);
  const self = this;

  const controller = new (class implements Unsync.EventController {
    #exists: boolean = true;

    public exists(): this is { on(): void, off(): void, del(): void } {
      return this.#exists;
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
      this.#exists = false;
    }
  });

  return controller;
}

export function addEventListenerEnum<IterableClass extends Iterable<T>, T extends EventTarget>(
  this: IterableClass,
  type: keyof EventMapOf<T>,
  listener: (this: T, e: EventMapOf<T>[keyof EventMapOf<T>]) => unknown,
  options?: boolean | AddEventListenerOptions
): void {
  for (const el of this) {
    if (el instanceof Element) {
      el.addEventListener(type as string, listener as EventListener, options);
    }
  }
}