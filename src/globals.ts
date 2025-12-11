import * as Opti from "./misc";

function typeObject<T>(val: T, str: string, basicStr: string = str): TypeGuard<T> {
  let v: T = val;
  let obj: TypeGuard<T> = Object.create({
    get value() {
      return v;
    },
    stringOf() { return str; },
    stringOfBasic() { return basicStr; },
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
          return v === other;
        case "function":
          const regex = /<([\w$_0-9]+)>\(([\w$_0-9,\s]*)\)/;
          const match = str.match(regex);

          if (match) {
            const [, name, args] = match;

            return name === (other.name || "anonymous") && args === Opti.args.apply(other as Func).join(",");
          }
          throw new TypeException(`Internal type matching error: Incorrect format for type string ${str}`);
        case "undefined":
          return v === undefined;
        case "object":
          if (other === null) {
            return v === null;
          }
          const ctorName = (other as any).constructor?.name;
          if (ctorName && str.includes(ctorName)) return true;

          if (typeof (other as any).toString === "function") {
            return str === (other as any).toString();
          }

          return false;
      }
    },
    isInstanceOf(clazz: Class) {
      if (v === null || v === undefined) return false;
      return Object(v) instanceof clazz;
    },
    isDefined() {
      return v !== undefined && v !== null;
    },
    isFalsy() {
      return !v;
    },
    isTruthy() {
      return !!v;
    },
    isNull() {
      return v === null;
    },
    isUndefined() {
      return v === undefined;
    },
    alwaysDefined(orElse: T) {
      v ??= orElse;
    },
    alwaysTruthy(truthy: Truthy<T>) {
      v = truthy;
    },
    isTypeString(typestr: string) {
      return typestr === str;
    },
    isTypeOf(type: Primitive) {
      return typeof v === type;
    }
  });

  function hasOwn<U extends string>(val: T, prop: U): val is typeof val & { [K in U]: number } {
    if (val === null || val === undefined) {
      return false;
    }

    if (typeof val === "string") return true;
    return Object.prototype.hasOwnProperty.call(val, prop);
  }

  if (typeof v === "string" || hasOwn(v, "size") || hasOwn(v, "length")) {
    obj = Object.assign(obj, {
      isShorter(lengthOrObject: number | Sized): boolean {
        const len = typeof lengthOrObject === "number"
          ? lengthOrObject
          : ("size" in lengthOrObject
            ? lengthOrObject.size
            : lengthOrObject.length);

        if (hasOwn(v, "size") && typeof v.size === "number") {
          return v.size < len;
        } else if (typeof v === "string" || (hasOwn(v, "length") && typeof v.length === "number")) {
          return v.length < len;
        }

        return false;
      },

      isLonger(lengthOrObject: number | Sized): boolean {
        const len = typeof lengthOrObject === "number"
          ? lengthOrObject
          : ("size" in lengthOrObject
            ? lengthOrObject.size
            : lengthOrObject.length);

        if (hasOwn(v, "size") && typeof v.size === "number") {
          return v.size > len;
        } else if (hasOwn(v, "length") && typeof v.length === "number") {
          return v.length > len;
        }

        return false;
      },

      isLength(length: number): boolean {
        if (hasOwn(v, "size") && typeof v.size === "number") {
          return v.size === length;
        } else if (hasOwn(v, "length") && typeof v.length === "number") {
          return v.length === length;
        }
        return false;
      }
    });
  }

  if (Array.isArray(v)) {
    obj = Object.assign(obj, {
      containsValues(countNullish: boolean = false): boolean {
        let arr: any[] = v as any[];
        if (!countNullish) arr = arr.filter(val => val !== null && val !== undefined);
        return arr.length > 0;
      },
      alwaysContainsValues(values: [any, ...any[]]): void {
        if ((v as unknown[]).length === 0) {
          (v as unknown[]).push(...values);
        }
      }
    });
  }

  if (typeof v === "function") {
    const functionName = (v as Func).name; 

    obj = Object.assign(obj, {
      isName(name: string): boolean {
        if (functionName === "") return name === "anonymous";
        return functionName === name;
      }
    });
  }

  return obj;
}

export function typed<T>(val: T): TypeGuard<T> {
  if (val === null) return typeObject<T>(val, "null");
  if (val === undefined) return typeObject<T>(val, "undefined");

  if (typeof val === "function") {
    // const combos: any[][] = [];
    // const primitives = [
    //   undefined,
    //   null,
    //   true,
    //   false,
    //   -1,
    //   0,
    //   1,
    //   Infinity,
    //   NaN,
    //   "",
    //   "text",
    //   Symbol("sym")
    // ];
    // const err: any[] = [];
    // const arity = val.length;

    // for (let i = 0; i < arity; i++) {
    //   combos.push(primitives);
    // }

    // for (const combo of combos) {
    //   try {
    //     val(...combo);
    //     continue;
    //   } catch (e) {
    //     if (e instanceof TypeError) err.push(combo);
    //     else throw e;
    //   }
    // }

    return typeObject(val, `Function:${val.name || "<anonymous>"}(${Opti.args.apply(val as Func).join(",")})`);
  }

  let typeName = Object.prototype.toString.call(val).slice(8, -1);
  typeName = typeName[0].toUpperCase() + typeName.slice(1);

  const ctor = val.constructor.name;
  if (ctor && ctor === "Object") {
    typeName = ctor;
  }

  const valtype = typeof val;
  const basicTypeName = valtype === "object" ? valtype : typeName;

  switch (typeof val) {
    case "string":
      typeName += `(${val.length})`;
      break;
    case "object":
      if (val instanceof Map || val instanceof Set) {
        typeName += `(${val.size})`;
      } else if (val instanceof Date && !isNaN(val.getTime())) {
        typeName += `:${val.toISOString().split("T")[0]}`;
      } else if ("length" in val && Number.isFinite(val.length)) {
        typeName += `(${val.length})`;
      } else if (typeName === "Object") {
        typeName += `(${Object.keys(val).length})`;
      }
      break;
    case "symbol":
      typeName += `(${val.description})`;
  }

  return typeObject<T>(val, typeName, basicTypeName);
};

export function info(val: any): string {
  return String(val);
}

export function assert(condition: boolean, reason?: string): asserts condition {
  if (!condition) {
    throw new globalThis.AssertionException(reason);
  }
}

export function sleep(ms: number): Future<void, NumberTooSmallException> {
  return new Future((res, rej) => {
    if (ms <= 0) return rej(new NumberTooSmallException("Invalid timeout value (must be greater than 0)"));
    setTimeout(res, ms);
  });
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