/// <reference path="../../../types/modules/secrets.d.ts" />

/** @future */
export function mixin<T extends Func>(
  fn: T,
  location: "HEAD",
  mixinFn: T
): T;

export function mixin<T extends Func, This = ThisParameterType<T>, Ret = ReturnType<T>>(
  fn: T,
  location: "TAIL",
  mixinFn: (this: This & { mixin: { value: Ret } }, ...args: Parameters<T>) => Ret
): T;

export function mixin<T extends Func, This = ThisParameterType<T>, Ret = ReturnType<T>>(
  fn: T,
  location: "HEAD" | "TAIL",
  mixinFn: Func
): T {
  switch (location) {
    case "HEAD":
      return (function (this: This, ...args: Parameters<T>): Ret {
        mixinFn.call(this, ...args);
        return fn.call(this, ...args);
      }) as T;

    case "TAIL":
      return (function (this: This, ...args: Parameters<T>): Ret {
        const result = fn.call(this, ...args);
        const self = Object.assign({ mixin: { value: result } }, this);
        mixinFn.call(self, ...args);
        return result;
      }) as T;
  }
}

export function getEvents<T extends EventTarget, K extends keyof EventMapOf<T> = keyof EventMapOf<T>>(target: T, key: K): EventListenerInfo<T, K>[];
export function getEvents<T extends EventTarget>(target: T): { [K in keyof EventMapOf<T>]: EventListenerInfo<T, K>[] };
export function getEvents<T extends EventTarget, K extends keyof EventMapOf<T> = keyof EventMapOf<T>>(target: T, key?: K): { [_ in keyof EventMapOf<T>]: EventListenerInfo<T, K>[] } | EventListenerInfo<T, K>[] {
  if (key === undefined) {
    //@ts-ignore
    return target._events;
  }                         

  return target._events[key] ?? [];
}

const originalAddEventListener = EventTarget.prototype.addEventListener;

export const addEventListener = mixin(
  originalAddEventListener,
  "HEAD",
  function <T extends EventTarget, K extends keyof EventMapOf<T>>(this: T, type: K, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    let _evFuncType: "default" | "conditional" | "controller" | undefined;
    let _evFuncData: ((this: unknown) => boolean) | number | undefined;
    
    this._events[type] ??= [];

    const listener: EventTarget.Func<T, K> =
      "handleEvent" in callback
        ? (callback.handleEvent as EventTarget.Func<T, K>)
        : (callback as EventTarget.Func<T, K>);

    const evType = _evFuncType ?? "default";

    let res: EventListenerInfo<T, K>;

    if (evType === "conditional") {
      // special must be number | function
      let specialValue: number | ((this: T, e: EventMapOf<T>[K]) => boolean);
      if (typeof _evFuncData === "number" || typeof _evFuncData === "function") {
        specialValue = _evFuncData as number | ((this: T, e: EventMapOf<T>[K]) => boolean);
      } else {
        specialValue = Infinity; // fallback call count
      }

      res = {
        type,
        func: listener,
        options: typeof options === "boolean" ? { capture: options } : options ?? {},
        listener: "conditional",
        special: specialValue
      };
    } else {
      // default/controller branch: special must be undefined
      res = {
        type,
        func: listener,
        options: typeof options === "boolean" ? { capture: options } : options ?? {},
        listener: evType,
        special: undefined
      };
    }

    this._events[type].push(res);
  }
);