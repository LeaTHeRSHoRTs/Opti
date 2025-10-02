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