import * as Classes from "./classes";
import * as Doc from "./document";
import * as Elements from "./elements";
import * as Exceptions from "./exception";
import * as Globals from "./globals";
import * as Lists from "./lists";
import * as Misc from "./misc";

function get<T>(
  object: T,
  prop: keyof T,
  getter: () => any
): void {
  Object.defineProperty(object, prop, {
    get: getter,
    enumerable: false,
    configurable: true
  });
}

(function() {
  globalThis.opti = {
    crafty: false,
    query: false,
    evented: false,
    requests: false,
    templated: false,
    flow: false
  };

  globalThis.Exception = Exceptions.Exception;
  globalThis.SyntaxException = Exceptions.SyntaxException;
  globalThis.TypeException = Exceptions.TypeException;
  globalThis.CloneException = Exceptions.CloneException;
  globalThis.NumberTooSmallException = Exceptions.NumberTooSmallException;
  globalThis.AssertionException = Exceptions.AssertionException;
  globalThis.NotImplementedException = Exceptions.NotImplementedException;
  globalThis.AccessException = Exceptions.AccessException;
  globalThis.UnknownException = Exceptions.UnknownException;
  globalThis.DebouncedException = Exceptions.DebouncedException;
  globalThis.RuntimeException = Exceptions.RuntimeException; 

  globalThis.f = (iife: () => void) => iife();
  globalThis.type = Globals.type;
  globalThis.assert = Globals.assert;
  globalThis.sleep = Globals.sleep;
  globalThis.isEmpty = Globals.isEmpty;
  globalThis.notEmpty = Globals.notEmpty;

  globalThis.Enum = Classes.Enum;
  globalThis.Tuple = Classes.Tuple;

  globalThis.Collection = Classes.Collection; 

  get(Window.prototype, "width", () => window.innerWidth || document.body.clientWidth );
  get(Window.prototype, "height", () => window.innerHeight || document.body.clientHeight );

  Document.prototype.ready = Doc.ready;
  Document.prototype.leaving = Doc.leaving;
  Document.prototype.css = Doc.documentCss;
  Document.prototype.createElements = Doc.createElements;

  Node.prototype.$ = Elements.find;
  Node.prototype.$$ = Elements.findAll;
  Node.prototype.parent = Elements.getParent;
  Node.prototype.ancestor = Elements.getAncestor;
  Node.prototype.getChildren = Elements.getChildren;
  Node.prototype.siblings = Elements.getSiblings;

  Element.prototype.hasText = Elements.hasText;
  Element.prototype.txt = Elements.text;
  Element.prototype.html = Elements.html;
  Element.prototype.addClass = Elements.addClass;
  Element.prototype.removeClass = Elements.removeClass;
  Element.prototype.toggleClass = Elements.toggleClass;
  Element.prototype.hasClass = Elements.hasClass;

  HTMLElement.prototype.css = Elements.css;
  HTMLElement.prototype.show = Elements.show;
  HTMLElement.prototype.hide = Elements.hide;
  HTMLElement.prototype.toggle = Elements.toggle;
  get(HTMLElement.prototype, "isVisible", Elements.isVisible);

  get(HTMLInputElement.prototype, "val", function(this: HTMLInputElement) { return this.value; });

  HTMLFormElement.prototype.serialize = Elements.serialize;

  NodeList.prototype.addEventListener = Lists.addEventListenerEnum;
  NodeList.prototype.addClass = Lists.addClassList;
  NodeList.prototype.removeClass = Lists.removeClassList;
  NodeList.prototype.toggleClass = Lists.toggleClassList;

  HTMLCollection.prototype.addEventListener = Lists.addEventListenerEnum;
  HTMLCollection.prototype.addClass = Lists.addClassList;
  HTMLCollection.prototype.removeClass = Lists.removeClassList;
  HTMLCollection.prototype.toggleClass = Lists.toggleClassList;

  EventTarget.prototype.addEventListener = Misc.addEventListener;
  (EventTarget.prototype as any)._events = {};
  get(EventTarget.prototype, "events", function(this: EventTarget) { return (this as any)["_events"] as EventTarget["events"]; });

  String.prototype.remove = Misc.remove;
  String.prototype.matches = Misc.matches;
  String.prototype.removeAll = Misc.removeAll;
  String.prototype.capitalize = Misc.capitalize;
  String.prototype.toCase = Misc.toCase;

  Number.prototype.repeat = Misc.repeat;

  Function.debounce = Misc.debounce;
  Function.throttle = Misc.throttle;
  Function.memo = Misc.memo;
  get(Function.prototype, "args", Misc.args);

  Array.prototype.unique = Misc.unique;
  Array.prototype.chunk = Misc.chunk;
  Array.prototype.pluck = Misc.pluck;
  Array.prototype.pluckLast = Misc.pluckLast;
  Array.prototype.relocate = Misc.relocate;
  Array.prototype.relocateTo = Misc.relocateTo;
  Array.prototype.replace = Misc.replace;
  Array.prototype.sort = Misc.sortBy;
  get(Array.prototype, "type", Misc.arrayType);

  Math.random = Misc.random;

  Object.clone = Misc.clone;
  Object.forEach = Misc.forEach;

  Date.at = Misc.atDate;
  Date.fromTime = Misc.fromTime;

  console = Misc.consoleProxy;
  console.group = Misc.group;
  console.on = Misc.consoleOn;
  console.off = Misc.consoleOff;
})();
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


export function addEventListenerEnum<IterableClass extends Iterable<T>, T extends EventTarget>(
  this: IterableClass,
  type: keyof EventMapOf<T>,
  listener: (this: T, e: EventMapOf<T>[keyof EventMapOf<T>]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  for (const el of this) {
    if (el instanceof Element) {
      el.addEventListener(type as string, listener as EventListener, options);
    }
  }
}

export function addClassList<T extends Element>(this: Iterable<T>, elClass: string): void {
  for (const el of this) {
    el.addClass(elClass);
  }
};

export function removeClassList<T extends Element>(this: Iterable<T>, elClass: string): void {
  for (const el of this) {
    el.removeClass(elClass);
  }
};

export function toggleClassList<T extends Element>(this: Iterable<T>, elClass: string): void {
  for (const el of this) {
    el.toggleClass(elClass);
  }
};
import * as Opti from "./misc";

function extendedString<T>(val: T, str: string): TypeOperators<T> {
  let obj: TypeOperators<T> = Object.create({
    stringOf() { return str; },
    is(other: unknown): boolean {
      switch (typeof other) {
        case "string":
          if (other.startsWith("type:")) {
            return other.replace("type:", "") === str;
          }
        case "number":
        case "bigint":
        case "boolean":
        case "symbol":
          return val === other;
        case "function":
          const regex = /<([\w$_0-9]+)>\(([\w$_0-9,\s]*)\)/;
          const match = str.match(regex);

          if (match) {
            const [, name, args] = match;

            return name === (other.name || "anonymous") && args === Opti.args.apply(other as Func).join(",");
          }
          throw new globalThis.TypeException(`Internal type matching error: Incorrect format for type string ${str}`);
        case "undefined":
          return val === undefined;
        case "object":
          if (other === null) {
            return val === null;
          }
          const ctorName = (other as any).constructor?.name;
          if (ctorName && str.includes(ctorName)) return true;

          if (typeof (other as any).toString === "function") {
            return str === (other as any).toString();
          }

          return false;
      }
    },
    isType(typestr: string) {
      return typestr === str;
    }
  });

  function hasOwn<U extends string>(val: T, prop: U): val is typeof val & { [K in U]: number } {
    if (val === null || val === undefined) {
      return false;
    }

    if (typeof val === "string") return true;
    return Object.prototype.hasOwnProperty.call(val, prop);
  }

  if (typeof val === "string" || hasOwn(val, "size") || hasOwn(val, "length")) {
    obj = Object.assign(obj, {
      isShorter(lengthOrObject: number | Sized): boolean {
        const len = typeof lengthOrObject === "number"
          ? lengthOrObject
          : ("size" in lengthOrObject
            ? lengthOrObject.size
            : lengthOrObject.length);

        if (hasOwn(val, "size") && typeof val.size === "number") {
          return val.size < len;
        } else if (typeof val === "string" || (hasOwn(val, "length") && typeof val.length === "number")) {
          return val.length < len;
        }

        return false;
      },

      isLonger(lengthOrObject: number | Sized): boolean {
        const len = typeof lengthOrObject === "number"
          ? lengthOrObject
          : ("size" in lengthOrObject
            ? lengthOrObject.size
            : lengthOrObject.length);

        if (hasOwn(val, "size") && typeof val.size === "number") {
          return val.size > len;
        } else if (hasOwn(val, "length") && typeof val.length === "number") {
          return val.length > len;
        }

        return false;
      },

      isLength(length: number): boolean {
        if (hasOwn(val, "size") && typeof val.size === "number") {
          return val.size === length;
        } else if (hasOwn(val, "length") && typeof val.length === "number") {
          return val.length === length;
        }
        return false;
      }
    });
  }

  if (typeof val === "function") {
    obj = Object.assign(obj, {
      isName(name: string): boolean {
        return val.name === name;
      }
    });
  }

  return obj;
}
export function type<T>(val: T): TypeOperators<T> {
  if (val === null) return extendedString<T>(val, "null");
  if (val === undefined) return extendedString<T>(val, "undefined");

  if (typeof val === "function") {
    return extendedString(val, `Function:${val.name || "<anonymous>"}(${Opti.args.apply(val as Func).join(",")})`);
  }

  let typeName = Opti.capitalize.call(Object.prototype.toString.call(val).slice(8, -1));

  const ctor = val.constructor?.name;
  if (ctor && ctor !== typeName) {
    typeName = ctor;
  }

  const len = (val as any).length;
  if (typeof len === "number" && Number.isFinite(len)) {
    typeName += `(${len})`;
  } else if (val instanceof Map || val instanceof Set) {
    typeName += `(${val.size})`;
  } else if (val instanceof Date && !isNaN(val.getTime())) {
    typeName += `:${val.toISOString().split("T")[0]}`;
  } else if (typeName === "Object") {
    typeName += `(${Object.keys(val).length})`;
  }

  return extendedString<T>(val, typeName);
};

export function info(val: any): string {
  return String(val);
}

export function assert(condition: boolean, reason?: string): asserts condition {
  if (!condition) {
    throw new globalThis.AssertionException(reason);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((res, rej) => {
    setTimeout(res, ms);
    rej();
  });
}

// Mapping of style keywords to ANSI escape codes for terminal formatting
const styles: Record<string, string> = {
  red: "\x1b[31m",
  orange: "\x1b[38;5;208m", // extended ANSI orange
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  purple: "\x1b[35m",
  pink: "\x1b[38;5;205m", // extended ANSI pink
  underline: "\x1b[4m",
  bold: "\x1b[1m",
  strikethrough: "\x1b[9m",
  italic: "\x1b[3m",
  emphasis: "\x1b[3m", // alias for italic
  reset: "\x1b[0m",
};

/** @potential */
export function Colorize(strings: TemplateStringsArray, ...values: any[]) {
  // Combine all parts of the template string with interpolated values
  let input = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");

  // Replace shorthand syntax for bold and underline
  // Replace {_..._} and {*...*} with {underline:...}, and {**...**} with {bold:...}
  input = input
    .replace(/\{_([^{}]+)_\}/g, (_, content) => `{underline:${content}}`)
    .replace(/\{\*\*([^{}]+)\*\*\}/g, (_, content) => `{bold:${content}}`)
    .replace(/\{\*([^{}]+)\*\}/g, (_, content) => `{underline:${content}}`)
    .replace(/\\x1b/g, '\x1b');

  // Replace escaped braces \{ and \} with placeholders so they are not parsed as tags
  input = input.replace(/\\\{/g, "__ESCAPED_OPEN_BRACE__").replace(/\\\}/g, "__ESCAPED_CLOSE_BRACE__");

  let output = ""; // Final output string with ANSI codes
  const stack: string[] = []; // Stack to track open styles for proper nesting
  let i = 0; // Current index in input

  while (i < input.length) {
    // Match the start of a style tag like {red: or {(dynamic ANSI code):
    const openMatch = input.slice(i).match(/^\{([a-zA-Z]+|\([^)]+\)):/);

    if (openMatch) {
      let tag = openMatch[1];

      if (tag.startsWith("(") && tag.endsWith(")")) {
        // Dynamic ANSI escape code inside parentheses
        tag = tag.slice(1, -1); // remove surrounding parentheses
        stack.push("__dynamic__");
        output += tag; // Insert raw ANSI code directly
      } else {
        if (!styles[tag]) {
          throw new globalThis.Exception(`Unknown style: ${tag}`);
        }
        stack.push(tag);
        output += styles[tag];
      }
      i += openMatch[0].length; // Move index past the opening tag
      continue;
    }

    // Match closing tag '}'
    if (input[i] === "}") {
      if (!stack.length) {
        // No corresponding opening tag
        throw new globalThis.Exception(`Unexpected closing tag at index ${i}`);
      }
      stack.pop(); // Close the last opened tag
      output += styles.reset; // Reset styles
      // Re-apply all remaining styles still on the stack
      for (const tag of stack) {
        // Reapply dynamic codes as-is, else mapped styles
        output += tag === "__dynamic__" ? "" : styles[tag];
      }
      i++; // Move past closing brace
      continue;
    }

    // Append normal character to output, but restore escaped braces if needed
    if (input.startsWith("__ESCAPED_OPEN_BRACE__", i)) {
      output += "{";
      i += "__ESCAPED_OPEN_BRACE__".length;
      continue;
    }
    if (input.startsWith("__ESCAPED_CLOSE_BRACE__", i)) {
      output += "}";
      i += "__ESCAPED_CLOSE_BRACE__".length;
      continue;
    }

    output += input[i++];
  }

  // If stack is not empty, we have unclosed tags
  if (stack.length) {
    const lastUnclosed = stack[stack.length - 1];
    throw new globalThis.Exception(`Missing closing tag for: ${lastUnclosed}`);
  }

  // Ensure final reset for safety
  return output + styles.reset;
}

export function isEmpty(val: string): val is "";
export function isEmpty(val: number): val is typeof NaN;
export function isEmpty(val: boolean): val is false;
export function isEmpty(val: null | undefined): true;
export function isEmpty(val: Array<any>): val is [];
export function isEmpty(val: Record<any, unknown>): val is Record<any, never>;
export function isEmpty(val: Map<any, any>): val is Map<any, never>;
export function isEmpty(val: Set<any>): val is Set<never>;
export function isEmpty(val: WeakMap<object, any>): val is WeakMap<object, any>;
export function isEmpty(val: WeakSet<object>): val is WeakSet<object>;
export function isEmpty(val: any): boolean {
  // Generic type checking
  // eslint-disable-next-line eqeqeq
  if (val == null || val === false || val === "") return true;

  // Number checking
  if (typeof val === "number") return val === 0 || Number.isNaN(val);

  // Array checking
  if (Array.isArray(val) && val.length === 0) return true;

  // Map, Set, and weak variant checks
  if (val instanceof Map || val instanceof Set || val instanceof WeakMap || val instanceof WeakSet) {
    return (val as any).size === 0; // size check works for these types
  }

  // Object checking
  if (typeof val === 'object') {
    const proto = Object.getPrototypeOf(val);
    const isPlain = proto === Object.prototype || proto === null;
    return isPlain && Object.keys(val).length === 0;
  }

  return false;
}

export function notEmpty(val: string | ""): val is string;
export function notEmpty(val: number | 0): val is number;
export function notEmpty(val: boolean): val is true;
export function notEmpty(val: null | undefined): false;
export function notEmpty(val: [...any] | []): val is [any, ...any];
export function notEmpty(val: Record<Key, unknown>): val is Record<Key, unknown>;
export function notEmpty(val: Map<any, any>): val is Map<any, never>;
export function notEmpty(val: Set<any>): val is Set<never>;
export function notEmpty(val: WeakMap<object, any>): val is WeakMap<object, any>;
export function notEmpty(val: WeakSet<object>): val is WeakSet<object>;
export function notEmpty(val: any): boolean {
  return !isEmpty(val);
}

/** @potential */
export function createEventListener<T extends ((...args: any[]) => any)[]>(
  triggers: T,
  callback: (...results: CallbackResult<T>) => void
): void {
  const originals = triggers.map(fn => fn);

  triggers.forEach((originalFn, i) => {
    function wrapper(this: any, ...args: any[]) {
      const result = originals[i].apply(this, args);
      callback(...triggers.map((_, j) =>
        j === i ? result : undefined
      ) as any);
      return result;
    };

    // Replace global function by matching the actual function object
    if (typeof window !== "undefined") {
      for (const key in window) {
        if ((window as any)[key] === originalFn) {
          (window as any)[key] = wrapper;
          return; // stop after replacement
        }
      }
    }

    console.warn("Cannot replace function:", originalFn);
  });
}

/** @potential */
export function UUID() {
  const UUIDChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%&*_-";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += UUIDChars.charAt(Math.floor(Math.random() * UUIDChars.length));
  }

  // Type assertion to add the brand
  return class { constructor() { return Object.freeze(result); } };
}

// eslint-disable-next-line prefer-const
export let opti = {
  crafty: false as false,
  query: false as false,
  evented: false as false,
  requests: false as false,
  templated: false as false,
  flow: false as false,
  help: {}
};
export class Exception extends Error {
  private _name: string;
  private _message: string;
  private _cause: string;
  private _internalStack: string;

  constructor(name: string | null, message: string = "", cause: string = "") {
    super();
    this._message = message;
    this._cause = cause;
    this._name = name ?? "Exception";
    this._internalStack = new Error().stack ?? "";
  }

  public get name(): string {
    return this._name;
  }

  public getMessage(): string {
    return this._message;
  }

  public getCause(): string {
    return this._cause;
  }

  public throw(): never {
    throw this;
  }

  public getStackTrace(): string {
    return this._internalStack;
  }

  public override toString(): string {
    return `${this._name}: ${this._message}\r\n${this._internalStack}`;
  }
}

export class RuntimeException {
  private _message: string;
  private _cause: string;

  public constructor(message: string = "", cause: string = "") {
    this._message = message;
    this._cause = cause;
  }

  public get name(): "RuntimeException" {
    return "RuntimeException";
  }

  public getMessage(): string {
    return this._message;
  }

  public getCause(): string {
    return this._cause;
  }

  public toString(): string {
    return `RuntimeException: ${this._message}`;
  }
}

function makeException(name: string): SubExceptionConstructor {
  return class extends Exception {
    constructor(message?: string, cause?: string) {
      super(name, message, cause);
    }
  };
}

export const SyntaxException = makeException("SyntaxException");
export const CloneException = makeException("CloneException");
export const NumberTooSmallException = makeException("NumberTooSmallException");
export const TypeException = makeException("TypeException");
export const NotImplementedException = makeException("NotImplementedException");
export const UnknownException = makeException("UnknownException");
export const AccessException = makeException("AccessException");
export const AssertionException = makeException("AssertionException");
/** @future */
export const FetchException = makeException("FetchException");
export const DebouncedException = makeException("DebouncedException");
function toKebabCase(str: string): string {
  return str
    // Add a hyphen before uppercase letters that are preceded by lowercase letters or numbers
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    // Replace spaces or underscores with hyphens
    .replace(/[\s_]+/g, "-")
    // Convert everything to lowercase
    .toLowerCase();
}

export function hasText (this: Element, text: string | RegExp): boolean {
  if (typeof text === "string") {
    return this.txt().includes(text);
  } else {
    return text.test(this.txt());
  }
}

export function addClass (this: Element, elClass: string): void {
  this.classList.add(elClass);
}

export function removeClass (this: Element, elClass: string): void {
  this.classList.remove(elClass);
}

export function toggleClass (this: Element, elClass: string): void {
  this.classList.toggle(elClass);
}

export function hasClass (this: Element, elClass: string): boolean {
  return this.classList.contains(elClass);
}

export function css(
  this: HTMLElement,
  key?: keyof CSSStyleDeclaration | Partial<Record<keyof CSSStyleDeclaration, string | number>>,
  value?: string | number
): any {
  const css = this.style;

  if (!key) {
    // Return all styles
    const result: Partial<Record<keyof CSSStyleDeclaration, string>> = {};
    for (let i = 0; i < css.length; i++) {
      const prop = css[i];
      if (prop) {
        result[prop as keyof CSSStyleDeclaration] = css.getPropertyValue(prop).trim();
      }
    }
    return result;
  }

  if (typeof key === "string") {
    if (value === undefined) {
      // Get one value
      return css.getPropertyValue(key).trim();
    } else {
      // Set one value
      if (key in css) {
        css.setProperty(toKebabCase(key), value.toString());
      }
    }
  } else {
    // Set multiple
    for (const [prop, val] of Object.entries(key)) {
      if (val !== null && val !== undefined) {
        css.setProperty(toKebabCase(prop), val.toString());
      }
    }
  }
};

export function getParent(this: ChildNode): ParentNode | null {
  return this.parentElement;
};

export function getAncestor<T extends Element>(this: ChildNode, arg: string | number): T | Node | null {
  // Case 1: numeric level
  if (typeof arg === "number") {
    let node: Node | null = this;
    for (let i = 0; i < arg; i++) {
      if (!node?.parentNode) return null;
      node = node.parentNode;
    }
    return node;
  }

  // Case 2: selector string
  const selector = arg;
  let el: Element | null = this instanceof Element ? this : this.parentElement;
  while (el) {
    if (el.matches(selector)) {
      return el as T;
    }
    el = el.parentElement;
  }
  return null;
}

export function html (this: Element, input?: string): string {
  return input !== undefined ? (this.innerHTML = input) : this.innerHTML;
};

export function text(this: Element, text?: string | ((text: string) => string), ...input: (string)[]): string {
  // If text is provided, update the textContent
  if (text !== undefined) {
    if (typeof text === "string") {
      input.unshift(text); // Add the text parameter to the beginning of the input array
      const joined = input.join(" "); // Join all the strings with a space

      // Replace "textContent" if it's found in the joined string (optional logic)
      this.textContent = joined.includes("textContent")
        ? joined.replace("textContent", this.textContent ?? "")
        : joined;
    } else {
      this.textContent = text(this.textContent ?? "");
    }
  }

  // Return the current textContent if no arguments are passed
  return this.textContent ?? "";
};

export function show(this: HTMLElement) {
  this.css("visibility", "visible");
};

export function hide(this: HTMLElement) {
  this.css("visibility", "hidden");
};

export function toggle(this: HTMLElement) {
  if (this.css("visibility") === "visible" || this.css("visibility") === "") {
    this.hide();
  } else {
    this.show();
  }
};

export function find(this: ParentNode, selector: string): Node | null {
  return this.querySelector(selector); // Returns a single Element or null
};

export function findAll(this: ParentNode, selector: string): NodeListOf<Element> {
  return this.querySelectorAll(selector); // Returns a single Element or null
};

export function getChildren(this: Node): NodeListOf<ChildNode> {
  return this.childNodes;
};

export function getSiblings(this: ChildNode, inclusive?: boolean): ChildNode[] {
  const siblings = Array.from(this.parentNode!.childNodes);
  if (inclusive) {
    return siblings; // Include current node as part of siblings
  } else {
    return siblings.filter(node => !node.isSameNode(this));
  }
};

export function serialize(this: HTMLFormElement): string {
  const formData = new FormData(this); // Create a FormData object from the form

  // Create an array to hold key-value pairs
  const entries: [string, string][] = [];

  // Use FormData's forEach method to collect form data
  formData.forEach((value, key) => {
    entries.push([key, value.toString()]);
  });

  // Convert the entries into a query string
  return entries
    .map(([key, value]) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
    .join('&'); // Join the array into a single string, separated by '&'
};

export function cut<T extends Element>(this: T): T {
  const clone = document.createElementNS(this.namespaceURI, this.tagName) as T;

  // Copy all attributes
  for (const attr of Array.from(this.attributes)) {
    clone.setAttribute(attr.name, attr.value);
  }

  // Deep copy child nodes (preserves text, elements, etc.)
  for (const child of Array.from(this.childNodes)) {
    clone.appendChild(child.cloneNode(true));
  }

  // Optionally copy inline styles (not always needed if using setAttribute above)
   if (this instanceof HTMLElement && clone instanceof HTMLElement) {
    clone.style.cssText = this.style.cssText;
  }

  this.remove(); // Remove original from DOM

  return clone;
}

export function isVisible(this: HTMLElement) {
  return this.css("visibility") !== "hidden"
    ? this.css("display") !== "none"
    : Number(this.css("opacity")) > 0;
}
export function ready (callback: (this: Document, ev: Event) => any) {
  document.addEventListener("DOMContentLoaded", callback);
}

export function leaving (callback: (this: Document, ev: Event) => any): void {
  document.addEventListener("unload", (e) => callback.call(document, e));
}

// export function bindShortcut (
//   shortcut: Shortcut,
//   callback: (event: ShortcutEvent) => void
// ): void {
//   document.addEventListener('keydown', (event: Event) => {
//     const keyboardEvent = event as ShortcutEvent;
//     keyboardEvent.keys = shortcut.split("+") as [KeyboardEventKey, KeyboardEventKey, KeyboardEventKey?, KeyboardEventKey?, KeyboardEventKey?];

//     const keys = shortcut
//       .trim()
//       .toLowerCase()
//       .split("+");

//     // Separate out the modifier keys and the actual key
//     const modifiers = keys.slice(0, -1);
//     const finalKey = keys[keys.length - 1];

//     const modifierMatch = modifiers.every((key: any) => {
//       if (key === 'ctrl' || key === 'control') return keyboardEvent.ctrlKey;
//       if (key === 'alt') return keyboardEvent.altKey;
//       if (key === 'shift') return keyboardEvent.shiftKey;
//       if (key === 'meta' || key === 'windows' || key === 'command') return keyboardEvent.metaKey;
//       return false;
//     });

//     // Check that the pressed key matches the final key
//     const keyMatch = finalKey === keyboardEvent.key.toLowerCase();

//     if (modifierMatch && keyMatch) {
//       callback(keyboardEvent);
//     }
//   });
// }

export function documentCss (
  element: string,
  object?: Partial<Record<keyof CSSStyleDeclaration, string | number>>
): any {
  const selector = element.trim();
  if (!selector) {
    throw new globalThis.SyntaxException("Selector cannot be empty.");
  }

  let styleTag = document.querySelector("style[js-styles]") as HTMLStyleElement | null;

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.setAttribute("js-styles", "");
    document.head.appendChild(styleTag);
  }

  const sheet = styleTag.sheet as CSSStyleSheet;
  let ruleIndex = -1;
  const existingStyles: StringRecord<string> = {};

  for (let i = 0; i < sheet.cssRules.length; i++) {
    const rule = sheet.cssRules[i];
    if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
      ruleIndex = i;
      const declarations = rule.style;
      for (let j = 0; j < declarations.length; j++) {
        const name = declarations[j];
        existingStyles[name] = declarations.getPropertyValue(name).trim();
      }
      break;
    }
  }

  if (!object || Object.keys(object).length === 0) {
    return existingStyles;
  }

  // Convert camelCase to kebab-case
  const newStyles: StringRecord<string> = {};
  for (const [prop, val] of Object.entries(object)) {
    if (val !== null && val !== undefined) {
      const kebab = prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
      newStyles[kebab] = val.toString();
    }
  }

  const mergedStyles = { ...existingStyles, ...newStyles };
  const styleString = Object.entries(mergedStyles)
    .map(([prop, val]) => `${prop}: ${val};`)
    .join(" ");

  if (ruleIndex !== -1) {
    sheet.deleteRule(ruleIndex);
  }

  try {
    sheet.insertRule(`${selector} { ${styleString} }`, sheet.cssRules.length);
  } catch (err) {
    console.error("Failed to insert CSS rule:", err, { selector, styleString });
  }
}

export function createElements<T extends HTMLElement>(node: ElementNode): T {
  const el = document.createElement(node.tag);

  // Add class if provided
  if (node.class) el.className = node.class;

  // Add text content if provided
  if (node.text) el.textContent = node.text;

  // Add inner HTML if provided
  if (node.html) el.innerHTML = node.html;

  // Handle styles, ensure it’s an object
  if (node.style && typeof node.style === 'object') {
    for (const [prop, val] of Object.entries(node.style)) {
      el.style.setProperty(prop, val.toString());
    }
  }

  // Handle other attributes (excluding known keys)
  for (const [key, val] of Object.entries(node)) {
    if (
      key !== 'tag' &&
      key !== 'class' &&
      key !== 'text' &&
      key !== 'html' &&
      key !== 'style' &&
      key !== 'children'
    ) {
      if (typeof val === 'string') {
        el.setAttribute(key, val);
      } else throw new globalThis.TypeException("Custom parameters must be of type 'string'");
    }
  }

  // Handle children (ensure it's an array or a single child)
  if (node.children) {
    if (Array.isArray(node.children)) {
      node.children.forEach(child => {
        el.appendChild(createElements(child));
      });
    } else {
      el.appendChild(createElements(node.children)); // Support for a single child node
    }
  }

  return el as T;
}

export function $ (selector: string) {
  return document.querySelector(selector);
};

export function $$ (selector: string) {
  return document.querySelectorAll(selector);
};


export class HTMLElementCreator {
  private superEl: DocumentFragment;
  private currContainer: HTMLElement;
  private parentStack: HTMLElement[] = [];

  constructor(tag: HTMLElement | keyof HTMLElementTagNameMap, attrsOrPosition: HTMLAttrs = {}) {
    this.superEl = document.createDocumentFragment();

    if (tag instanceof HTMLElement) {
      this.currContainer = tag;
      this.superEl.append(tag);
    } else {
      const el = document.createElement(tag);
      this.makeElement(el as HTMLElement, attrsOrPosition);
      this.currContainer = el as HTMLElement;
      this.superEl.append(el);
    }
  }

  private makeElement(el: HTMLElement, attrs: HTMLAttrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "text") {
        el.textContent = value as string;
      } else if (key === "html") {
        el.innerHTML = value as string;
      } else if (key === "class") {
        if (typeof value === "string") {
          el.classList.add(value);
        } else if (Array.isArray(value)) {
          el.classList.add(...value.filter(c => typeof c === 'string' && c.trim()));
        }
      } else if (key === "style") {
        let styles = "";
        Object.entries(value as object).forEach(([styleKey, styleValue]) => {
          styles += `${(styleKey)}: ${styleValue}; `;
        });
        el.setAttribute("style", styles.trim());
      } else if (typeof value === "boolean") {
        if (value) el.setAttribute(key, "");
        else el.removeAttribute(key);
      } else if (value !== undefined && value !== null) {
        el.setAttribute(key, value as string);
      }
    });
  }

  public el(tag: keyof HTMLElementTagNameMap, attrs: HTMLAttrs = {}): HTMLElementCreator {
    const child = document.createElement(tag);
    this.makeElement(child as HTMLElement, attrs);
    this.currContainer.appendChild(child);
    return this;
  }

  public container(tag: keyof HTMLElementTagNameMap, attrs: HTMLAttrs = {}): HTMLElementCreator {
    const wrapper = document.createElement(tag);
    this.makeElement(wrapper as HTMLElement, attrs);
    this.parentStack.push(this.currContainer);
    this.currContainer.appendChild(wrapper);
    this.currContainer = wrapper as HTMLElement;
    return this;
  }

  public up(): HTMLElementCreator {
    const prev = this.parentStack.pop();
    if (prev) {
      this.currContainer = prev;
    }
    return this;
  }

  public append(to: HTMLElement | string) {
    const target = typeof to === "string" ? document.querySelector(to) : to;
    if (target instanceof HTMLElement) {
      target.append(this.superEl);
    }
  }

  public prepend(to: HTMLElement | string) {
    const target = typeof to === "string" ? document.querySelector(to) : to;
    if (target instanceof HTMLElement) {
      target.prepend(this.superEl);
    }
  }

  public get element(): HTMLElement {
    return this.currContainer;
  }
}

/** @potential */
export class Time {
  private hours: number;
  private minutes: number;
  private seconds: number;
  private milliseconds: number;

  public constructor();
  public constructor(hours: Date);
  public constructor(hours: number, minutes: number, seconds?: number, milliseconds?: number);
  public constructor(hours?: number | Date, minutes?: number, seconds?: number, milliseconds?: number) {
    if (hours instanceof Date) {
      this.hours = hours.getHours();
      this.minutes = hours.getMinutes();
      this.seconds = hours.getSeconds();
      this.milliseconds = hours.getMilliseconds();
    } else {
      const now = new Date();
      this.hours = hours ?? now.getHours();
      this.minutes = minutes ?? now.getMinutes();
      this.seconds = seconds ?? now.getSeconds();
      this.milliseconds = milliseconds ?? now.getMilliseconds();
    }

    this.validateTime();
  }

  // Validation for time properties
  private validateTime(): void {
    if (this.hours < 0 || this.hours >= 24) throw new globalThis.SyntaxException("Hours must be between 0 and 23.");
    if (this.minutes < 0 || this.minutes >= 60) throw new globalThis.SyntaxException("Minutes must be between 0 and 59.");
    if (this.seconds < 0 || this.seconds >= 60) throw new globalThis.SyntaxException("Seconds must be between 0 and 59.");
    if (this.milliseconds < 0 || this.milliseconds >= 1000) throw new globalThis.SyntaxException("Milliseconds must be between 0 and 999.");
  }

  public static of(date: Date) {
    return new this(date);
  }

  // Getters
  public getHours(): number { return this.hours; }
  public getMinutes(): number { return this.minutes; }
  public getSeconds(): number { return this.seconds; }
  public getMilliseconds(): number { return this.milliseconds; }

  // Setters
  public setHours(hours: number): void {
    this.hours = hours;
    this.validateTime();
  }
  public setMinutes(minutes: number): void {
    this.minutes = minutes;
    this.validateTime();
  }
  public setSeconds(seconds: number): void {
    this.seconds = seconds;
    this.validateTime();
  }
  public setMilliseconds(milliseconds: number): void {
    this.milliseconds = milliseconds;
    this.validateTime();
  }

  // Returns the time in milliseconds since the start of the day
  public getTime(): number {
    return (
      this.hours * 3600000 +
      this.minutes * 60000 +
      this.seconds * 1000 +
      this.milliseconds
    );
  }

  // Returns the time in milliseconds since the start of the day
  public static at(hours: number, minutes: number, seconds?: number, milliseconds?: number): number {
    return new Time(hours, minutes, seconds, milliseconds).getTime();
  }

  public sync() {
    return new Time();
  }

  // Static: Return current time as a Time object
  public static now(): number {
    return new Time().getTime();
  }

  public toString() {
    return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;;
  }

  public toISOString(): string {
    return `T${this.toString()}.${this.milliseconds.toString().padStart(3, '0')}Z`;
  }

  public toJSON(): string {
    return this.toISOString(); // Leverage the existing toISOString() method
  }

  public toDate(years: number, months: number, days: number): Date {
    return new Date(years, months, days, this.hours, this.minutes, this.seconds, this.milliseconds);
  }

  public static fromDate(date: Date) {
    return new Time(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  }

  // Arithmetic operations
  public addMilliseconds(ms: number): Time {
    const totalMilliseconds = this.getTime() + ms;
    return Time.fromMilliseconds(totalMilliseconds);
  }

  public subtractMilliseconds(ms: number): Time {
    const totalMilliseconds = this.getTime() - ms;
    return Time.fromMilliseconds(totalMilliseconds);
  }

  public addSeconds(seconds: number): Time {
    return this.addMilliseconds(seconds * 1000);
  }

  public addMinutes(minutes: number): Time {
    return this.addMilliseconds(minutes * 60000);
  }

  public addHours(hours: number): Time {
    return this.addMilliseconds(hours * 3600000);
  }

  // Static: Create a Time object from total milliseconds
  public static fromMilliseconds(ms: number): Time {
    const hours = Math.floor(ms / 3600000) % 24;
    const minutes = Math.floor(ms / 60000) % 60;
    const seconds = Math.floor(ms / 1000) % 60;
    const milliseconds = ms % 1000;
    return new Time(hours, minutes, seconds, milliseconds);
  }

  // Parsing
  public static fromString(timeString: string): Time {
    const match = timeString.match(/^(\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{3}))?$/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3] ?? "0", 10);
      const milliseconds = parseInt(match[4] ?? "0", 10);
      return new Time(hours, minutes, seconds, milliseconds);
    }
    throw new globalThis.SyntaxException("Invalid time string format.");
  }

  public static fromISOString(isoString: string): Time {
    const match = isoString.match(/T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3], 10);
      const milliseconds = parseInt(match[4], 10);
      return new Time(hours, minutes, seconds, milliseconds);
    }
    throw new globalThis.SyntaxException("Invalid ISO string format.");
  }

  // Comparison
  public compare(other: Time): number {
    const currentTime = this.getTime();
    const otherTime = other.getTime();

    if (currentTime < otherTime) {
      return -1;
    } else if (currentTime > otherTime) {
      return 1;
    } else {
      return 0;
    }
  }

  public isBefore(other: Time): boolean {
    return this.compare(other) === -1;
  }

  public isAfter(other: Time): boolean {
    return this.compare(other) === 1;
  }

  public equals(other: Time): boolean {
    return this.compare(other) === 0;
  }

  public static equals(first: Time, other: Time): boolean {
    return first.compare(other) === 0;
  }
}

export function Tuple<T extends unknown[]>(...values: T) {
  return values;
}

export function Enum<T extends readonly string[]>(...values: T) {
  const obj = {} as { [K in T[number]]: symbol };

  values.forEach((val) => {
    const key = String(val);

    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) {
      throw new globalThis.SyntaxException("Enum values must be defined and may only be the characters A-Z, a-z, 0-9, _ and $");
    } else if (Object.prototype.hasOwnProperty.call(obj, key)) {
      throw new globalThis.SyntaxException("Enum members may only be unique");
    }

    Object.defineProperty(obj, key, {
      value: Symbol(key),
      enumerable: true,
      configurable: false,
      writable: false,
    });
  });

  // Add iterator
  Object.defineProperty(obj, Symbol.iterator, {
    enumerable: false,
    value: function* (): IterableIterator<T[number]> {
      for (const val of values) {
        yield val;
      }
    },
  });

  return obj;
}

export class Collection<T> {
  readonly length: number;
  private items: T[];

  constructor(items: T[]) {
    this.items = items;
    this.length = items.length;
  }

  public static from<T>(arrayLike: ArrayLike<T>) {
    return new Collection(Array.from(arrayLike));
  }

  [key: number]: T;

  item(index: number): T | null {
    return this.items[index] ?? null;
  }

  each(callback: (value: T, key: number) => void, thisArg?: any) {
    this.items.forEach(callback, thisArg);
  }

  *[Symbol.iterator]() {
    yield* this.items;
  }

  *entries() {
    yield* this.items.entries();
  }

  *keys() {
    yield* this.items.keys();
  }

  *values() {
    yield* this.items.values();
  }
}
