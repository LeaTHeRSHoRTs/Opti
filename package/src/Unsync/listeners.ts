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
    #applied: boolean = true;

    public get applied(): boolean {
      return this.#applied;
    }
    on() {
      self.addEventListener(type as string, listener as EventListener, options);
      this.#applied = true;
    }
    off() {
      self.removeEventListener(type as string, listener as EventListener, options);
      this.#applied = false;
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