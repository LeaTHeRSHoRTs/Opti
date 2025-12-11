type _EventsRecord<T extends EventTarget> = { [K in keyof EventMapOf<T>]?: EventListenerInfo<T, K>[] };

declare interface EventTarget {
  _events: _EventsRecord<this>;
}

//* Function

export function args(this: Func): string[] {
  return this.toString()
    .replace(/\s*=\s*.*?(,|\))/g, "$1")
    .match(/\(([^)]*)\)/)?.[1]
    .split(",")
    .map(p => p.trim())
    .filter(Boolean) || [];
}

export function throttle<T extends Func>(func: T, ms: number): (this: Func.This<T>, ...args: Func.Arguments<T>) => Func.Return<T> | null {
  let throttled: boolean = false;
  const cache: Func.Arguments<T>[] = [];
  return function (this: Func.This<T>, ...args: Func.Arguments<T>) {
    if (!throttled) {
      const self = this;
      throttled = true;
      const val: Func.Return<T> = func.apply(self, args);
      setTimeout(() => {
        throttled = false;
        if (cache.length > 0) func.apply(self, cache.shift()!);
      }, ms);
      return val;
    }
    cache.push(args);
    return null;
  };
}

export function debounce<T extends Func>(
  func: T,
  ms: number
): (this: Func.This<T>, ...args: Func.Arguments<T>) => Future<Func.Return<T>, DebouncedException> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let globRej: ((err?: DebouncedException) => void) | null = null;

  return function (this: Func.This<T>, ...args: Func.Arguments<T>) {
    if (globRej && timer) {
      const rej = globRej;
      globRej = null;
      rej(new DebouncedException());
    }

    const self = this;

    // Clear existing timer
    if (timer) clearTimeout(timer);

    return new Future<Func.Return<T>, DebouncedException>((res, rej) => {
      globRej = rej;

      timer = setTimeout(() => {
        globRej = null;
        timer = null; // clear timer reference
        res(func.apply(self, args));
      }, ms);
    });
  };
}

export function memo<T extends Func>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return function (this: Func.This<T>, ...args: Func.Arguments<T>): Func.Return<T> {
    const key = JSON.stringify(args); // unique per argument set
    if (cache.has(key)) return cache.get(key)!; // return cached result
    const result = fn.apply(this, args);       // call original function
    cache.set(key, result);                    // store in cache
    return result;
  } as T;
}

export function instMemo(this: Func) {
  return memo(this);
}

export function instDebounce(this: Func, ms: number) {
  return debounce(this, ms);
}

export function instThrottle(this: Func, ms: number) {
  return throttle(this, ms);
}

//* Date

export function atDate(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number {
  return new Date(year, monthIndex, date, hours, minutes, seconds, ms).getTime();
}

//* Object

export function clone<T>(object: symbol, deep?: boolean): never;
export function clone<T>(object: T, deep?: boolean): T;
export function clone<T>(object: T, deep: boolean = true): T {
  if (typeof object === "symbol") {
    throw new globalThis.CloneException("Symbols cannot be cloned");
  }

  if (!deep) {
    if (Array.isArray(object)) {
      return [...object] as T;
    }
    return { ...object };
  }

  if (
    object === null ||
    object === undefined ||
    typeof object !== "object"
  ) {
    return object;
  }

  if (object instanceof Date) {
    return new Date(object.getTime()) as T;
  }

  // Handle Arrays
  if (Array.isArray(object)) {
    return object.map(item => clone(item, true)) as T;
  }

  // Handle Maps
  if (object instanceof Map) {
    return new Map([...object].map(([k, v]) => [k, clone(v, true)])) as T;
  }

  // Handle Sets
  if (object instanceof Set) {
    return new Set([...object].map(item => clone(item, true))) as T;
  }

  // Handle plain objects
  const proto = Object.getPrototypeOf(object);
  const result = Object.create(proto);

  for (const key of Reflect.ownKeys(object)) {
    const value = (object as any)[key];
    (result as any)[key] = deep ? clone(value, true) : value;
  }

  return result;
};

export function forEach<T>(object: T, iterator: (key: keyof T, value: T[keyof T]) => any): void {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      iterator(key, object[key]);
    }
  }
};

//* Number

export function repeat(this: number, iterator: (i: number) => any): void {
  for (let i = 0; i < this; i++) {
    iterator(i);
  }
};

//* Strings

export function remove(this: string, finder: string | RegExp): string {
  return this.replace(finder, "");
};

export function capitalize(this: string): string {
  const i = this.search(/[a-z]/);
  return i === -1 ? this : this.slice(0, i) + this.charAt(i).toUpperCase() + this.slice(i + 1);
};

export function matches(this: String, regexp: string | RegExp) {
  return this.search(regexp) !== -1;
};

export function toCase(this: string, format: CaseConventions): string {
  const regex = /([\s_-]+)(\S)/g;
  const charRegex = /[\s]+/g;

  switch (format) {
    case "kebab": return this.replace(charRegex, "-");
    case "snake": return this.replace(charRegex, "_");
    case "dot": return this.replace(charRegex, ".");
    case "camel": return this.replace(regex, (_, _s, next) => next.toUpperCase());
    case "pascal": return this.replace(regex, (_, _s, next) => next.toUpperCase()).replace(/^\s*(\S)/, (_, first) => first.toUpperCase());
    case "train": return this.replace(regex, (_, _s, next) => next.toUpperCase()).replace(/^\s*(\S)/, (_, first) => first.toUpperCase());
  }
}

//* Math

const origionalRandom = Math.random;
export const random = (minOrMax?: number, max?: number) => {
  if (typeof minOrMax !== "undefined" && typeof max !== "undefined") {
    return origionalRandom() * (max - minOrMax) + minOrMax;
  } else if (typeof minOrMax !== "undefined") {
    return origionalRandom() * minOrMax;
  } else return origionalRandom();
};

//* Others

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
  mixinFn: any
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

export function getEvents<T extends EventTarget, K extends keyof EventMapOf<T> = any>(this: T, key: K): EventListenerInfo<T, K>[];
export function getEvents<T extends EventTarget>(this: T): { [K in keyof EventMapOf<T>]: EventListenerInfo<T, K>[] };
export function getEvents<T extends EventTarget, K extends keyof EventMapOf<T> = any>(this: T, key?: K) {
  if (key === undefined) {
    return this._events;
  }

  return this._events[key] ?? [];
}

const originalAddEventListener = EventTarget.prototype.addEventListener;

declare let _evFuncType: "default" | "conditional" | "controller" | undefined;
declare let _evFuncData: (number | ((this: any) => boolean)) | undefined;

export const addEventListener = mixin(
  originalAddEventListener,
  "HEAD",
  function <T extends EventTarget, K extends keyof EventMapOf<T>>(this: T, type: K, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    this._events[type] ??= [];

    const listener: EventFunc<T, K> =
      "handleEvent" in callback
        ? (callback.handleEvent as EventFunc<T, K>)
        : (callback as EventFunc<T, K>);

    this._events[type].push({
      func: listener,
      options:
        typeof options === "boolean"
          ? { capture: options }
          : options
          ? options
          : {},
      listener: _evFuncType ?? "default",
      special: _evFuncData
    });
  }
);