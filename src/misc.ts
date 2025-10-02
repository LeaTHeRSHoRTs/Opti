declare interface EventTarget {
  _events: Partial<Record<keyof EventMapOf<any>, number>>
}

//* Function

//! Utility
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
  return function(this: Func.This<T>, ...args: Func.Arguments<T>) {
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

export function debounce<T extends Func>(func: T, ms: number): (this: Func.This<T>, ...args: Func.Arguments<T>) => Promise<Func.Return<T>> {
  let timer: number;
  let globRej: ((reason?: any) => void) | null = null;
  
  return function(this: Func.This<T>, ...args: Func.Arguments<T>) {
    if (globRej) {
      globRej(new DebouncedException());
    }

    const self = this;

    clearTimeout(timer);
    return new Promise<Func.Return<T>>((res, rej) => {
      globRej = rej;
      timer = setTimeout(() => {
        globRej = null;
        res(func.apply(self, args));
      }, ms);
    });
  };
}

export function memo<T extends Func>(func: T, thisArg: Func.This<T>, ...args: Func.Arguments<T>): T {
  const res = func.call(thisArg, ...args);

  return function(this: Func.This<T>, ...innerArgs: Func.Arguments<T>) {
    if (thisArg === this && JSON.stringify(args) ===  JSON.stringify(innerArgs)) {
      return res;
    } else {
      return func.call(thisArg, ...args);
    }
  } as T;
}

//* Date

export function atDate(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number {
  return new Date(year, monthIndex, date, hours, minutes, seconds, ms).getTime();
}

export function fromTime (this: DateConstructor, time: Time, year: number, monthIndex: number, date?: number | undefined): Date {
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
    return new Map([...object].map(([k, v]) => [k, clone(v, true)]))as T;
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
  this.splice(res);

  if (res === -1) return null;
  return this[res];
}

export function pluckLast<T>(this: T[], finder: (v: T) => boolean): T | null {
  return [...this.reverse()].pluck(finder);
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
  return this.map(v => globalThis.type(v).stringOf());
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

export function sortBy<T>(this: T[], compareFn?: (a: T, b: T) => number): T[];
export function sortBy<T>(this: T[], order: "random"): T[];
export function sortBy<T extends string>(this: T[], order: "alpha" | "alpha-reverse"): T[];
export function sortBy<T extends number>(this: T[], order: "increasing" | "decreasing"): T[];
export function sortBy<T extends Date>(this: T[], order: "earlier" | "later"): T[];
export function sortBy<T>(this: T[], order?: string | ((a: T, b: T) => number)): T[] {
  if (typeof order === "function") {
    return this.sort(order);
  } else if (order === undefined) {
    return this.sort();
  }

  if (this.length === 0) return [];

  if (order === "random") {
    return this.sort(() => {
      return origionalRandom() - 0.5;
    });
  }

  if (arrType(this, Date)) {
    switch (order) {
      case "earlier": return [...this].sort((a, b) => a.getTime() - b.getTime());
      case "later": return [...this].sort((b, a) => b.getTime() - a.getTime());
    }
  } else if (arrType(this, String)) {
    switch (order) {
      case "alpha": return [...this].sort();
      case "alpha-reverse": return [...this].sort().reverse();
    }
  } else if (arrType(this, Number)) {
    switch (order) {
      case "earlier": return [...this].sort((a, b) => a - b);
      case "later": return [...this].sort((b, a) => b - a);
    }
  }

  return [...this].sort();
}

export function replace<T>(this: T[], index: number, newVal: T): T | null {
  const oldVal = this[index];
  this[index] = newVal;

  return oldVal ?? null;
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

//* Strings

export function remove(this: string, finder: string | RegExp): string {
  return this.replace(finder, "");
};

export function removeAll(this: string, finder: string | RegExp): string {
  return this.remove(new RegExp(finder, "g" + (finder instanceof RegExp ? finder.flags : "")));
};

export function capitalize(this: string): string {
  const i = this.search(/\S/);
  return i === -1 ? this : this.slice(0, i) + this.charAt(i).toUpperCase() + this.slice(i + 1);
};

export function matches(regexp: string | RegExp) { 
  return String.prototype.search(regexp) !== -1; 
};

export function toCase(this: string, format: "camel" | "kebab" | "pascal" | "snake" | "train" | "dot"): string {
  switch(format) {
    case "kebab":  return this.replace(/(\S)(\s)(\S)/g, (_, prev, space, next) => prev + "-" + next);
    case "snake":  return this.replace(/(\S)(\s)(\S)/g, (_, prev, space, next) => prev + "_" + next);
    case "dot":    return this.replace(/(\S)(\s)(\S)/g, (_, prev, space, next) => prev + "." + next);
    case "camel":  return this.replace(/(\S)(\s)(\S)/g, (_, prev, space, next) => prev + next.toUpperCase());
    case "pascal": return this.replace(/(\S)(\s)(\S)/g, (_, prev, space, next) => prev + next.toUpperCase()).replace(/^\s*(\S)/, (_, first) => first.toUpperCase());
    case "train":  return this.replace(/(\S)(\s)(\S)/g, (_, prev, space, next) => prev + next.toUpperCase()).replace(/^\s*(\S)/, (_, first) => first.toUpperCase());
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

//* Console

const origionalGroup = console.group;
export function group(name?: string, ...logs: any[][]): void {
  origionalGroup(name);

  if (logs.length > 0) {
    for (const val in logs) {
      console.log(val);
    }
    console.groupEnd();
  }
}

export const consoleProxy = new Proxy(console, {
  get(target, prop, receiver) {
    if ((console as any).hidden === true) {
      return null;
    }
    const val = Reflect.get(target, prop, receiver);
    return typeof val === "function" ? val.bind(target) : val;
  }
});

export function consoleOn() {
  (console as any).hidden = true;
}

export function consoleOff() {
  (console as any).hidden = false;
}

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

const originalAddEventListener = EventTarget.prototype.addEventListener;
export const addEventListener = mixin(
  originalAddEventListener,
  "HEAD",
  function<T extends EventTarget>(this: EventTarget, type: keyof EventMapOf<T>, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    if (!(this instanceof EventTarget)) return;

    // Initialize internal storage
    const store = (this._events ??= {}) as Partial<Record<keyof EventMapOf<T>, number>>;
    store[type] = (store[type] ?? 0) + 1;
  }
);

