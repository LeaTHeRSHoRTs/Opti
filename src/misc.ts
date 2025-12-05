declare interface EventTarget {
  _events: Partial<Record<keyof EventMapOf<this>, EventListener[]>>
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

//* Date

export function atDate(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number {
  return new Date(year, monthIndex, date, hours, minutes, seconds, ms).getTime();
}

export function fromTime(this: DateConstructor, time: Time, year: number, monthIndex: number, date?: number | undefined): Date {
  return new Date(year, monthIndex, date, time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
}

//* Object

export function clone<T>(object: symbol, deep?: boolean): never;
export function clone<T>(object: T, deep: boolean = true): T {
  if (typeof object === "symbol") {
    throw new globalThis.CloneException("Symbols cannot be cloned");
  }

  if (!deep) {
    if (Array.isArray(object)) {
      return [...object] as unknown as T;
    }
    return { ...object } as unknown as T;
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

//* Arrays

export function unique<T>(this: T[]): T[] {
  return [...new Set(this)];
};

export function pluck<T>(this: T[], finder: (v: T) => boolean): T | null {
  const res = this.findIndex(finder);

  if (res === -1) return null;

  const [item] = this.splice(res, 1);
  return item;
}

export function pluckLast<T>(this: T[], finder: (v: T) => boolean): T | null {
  // find index of last matching element
  const index = this.map(finder).lastIndexOf(true);
  if (index === -1) return null;

  // remove and return it
  const [item] = this.splice(index, 1);
  return item;
}

export function relocate<T>(this: T[], index: number, offset: number): number | null {
  const value = this.splice(index, 1)[0] ?? null;
  if (value) {
    this.splice(index + offset, 0, value);
    return index + offset;
  } else return null;
}

export function relocateTo<T>(this: T[], index: number, location: number): number | null {
  const value = this.splice(index, 1)[0] ?? null;
  if (value) {
    this.splice(location, 0, value);
    return location;
  } else return null;
}

type AnyConstructor<T = any> = new (...args: any[]) => T;

export function arrayType(this: any[]) {
  return this.map(v => globalThis.typed(v).stringOf());
}

function arrType<T extends AnyConstructor | StringConstructor | NumberConstructor | BooleanConstructor | SymbolConstructor>(
  array: any[],
  type: T
): array is Unboxed<T>[] {
  return array.every(v =>
    type === String ? typeof v === "string" :
      type === Number ? typeof v === "number" :
        type === Boolean ? typeof v === "boolean" :
          type === Symbol ? typeof v === "symbol" :
            v instanceof type
  );
}

const origionalSort: <T>(this: T[], compareFn?: ((a: any, b: any) => number) | undefined) => any[] = Array.prototype.sort;
export function sortBy<T>(this: T[], order?: SortMode<T> | ((a: T, b: T) => number)): T[] {
  if (typeof order === "function") {
    return origionalSort.call(this, order);
  } else if (order === undefined) {
    return origionalSort.call(this);
  }

  if (this.length === 0) return [];

  const copy = [...this];
  if (arrType(this, Date)) {
    switch (order) {
      case "earlier": return origionalSort.call(copy, (a, b) => a.getTime() - b.getTime());
      case "later": return origionalSort.call(copy, (a, b) => b.getTime() - a.getTime());
    }
  } else if (arrType(this, String)) {
    switch (order) {
      case "alpha": return origionalSort.call(copy);
      case "alpha-reverse": return origionalSort.call(copy).reverse();
    }
  } else if (arrType(this, Number)) {
    switch (order) {
      case "increasing": return origionalSort.call(copy, (a, b) => a - b);
      case "decreasing": return origionalSort.call(copy, (a, b) => b - a);
    }
  }

  return origionalSort.call(this);
}

export function shuffle<T>(this: T[]): T[] {
  return this.sort(() => {
    return origionalRandom() - 0.5;
  });
}

export function replace<T>(this: T[], index: number | ((value: T) => boolean), newVal: T): T | null {
  if (typeof index === "number") {
    const oldVal = this[index];
    this[index] = newVal;

    return oldVal ?? null;
  } else {
    const i = this.findIndex(index);
    if (i === -1) return null;

    const oldVal = this[i];
    this[i] = newVal;

    return oldVal;
  }
}

export function replaceLast<T>(this: T[], finder: (value: T) => boolean, newVal: T): T | null {
  for (let i = this.length - 1; i >= 0; i--) {
    if (finder(this[i])) {
      const oldVal = this[i];
      this[i] = newVal;
      return oldVal ?? null;
    }
  }
  return null;
}

export function chunk<T>(this: T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) throw new globalThis.NumberTooSmallException("`chunkSize` cannot be a number below 1");

  const newArr: T[][] = [];
  let tempArr: T[] = [];

  this.forEach(val => {
    tempArr.push(val);
    if (tempArr.length === chunkSize) {
      newArr.push(tempArr);
      tempArr = []; // Reset tempArr for the next chunk
    }
  });

  // Add the remaining elements in tempArr if any
  if (tempArr.length) {
    newArr.push(tempArr);
  }

  return newArr;
};

export function insert<U>(this: unknown[], index: number, ...values: U[]) {
  this.splice(index, 0, ...values);
}

//* Strings

export function remove(this: string, finder: string | RegExp): string {
  return this.replace(finder, "");
};

export function capitalize(this: string): string {
  const i = this.search(/\S/);
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

export function getEvents<T extends EventTarget>(this: T, key: keyof EventMapOf<T>): Func[] {
  return this._events[key] ?? [];
}

const originalAddEventListener = EventTarget.prototype.addEventListener;
export const addEventListener = mixin(
  originalAddEventListener,
  "HEAD",
  function <T extends EventTarget>(this: EventTarget, type: keyof EventMapOf<T>, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    if (!(this instanceof EventTarget)) return;

    this._events[type] ??= [];
    if ("handleEvent" in callback) {
      this._events[type].push(callback.handleEvent);
    } else {
      this._events[type].push(callback);
    }
  }
);