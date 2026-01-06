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
          const ctorName = other.constructor?.name;
          if (ctorName && str.includes(ctorName)) return true;

          if (typeof other.toString === "function") {
            return str === other.toString();
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
      return !Boolean(v);
    },
    isTruthy() {
      return Boolean(v);
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

  function hasOwn<U extends string>(intVal: T, prop: U): intVal is typeof intVal & { [K in U]: number } {
    if (intVal === null || intVal === undefined) {
      return false;
    }

    if (typeof intVal === "string") return true;
    return Object.prototype.hasOwnProperty.call(intVal, prop);
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
        let arr = v as unknown[];
        if (!countNullish) arr = arr.filter(fval => fval !== null && fval !== undefined);
        return arr.length > 0;
      },
      alwaysContainsValues(values: [unknown, ...unknown[]]): void {
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
  typeName = (typeName[0]?.toUpperCase() ?? "") + typeName.slice(1);

  const ctor = val.constructor.name;
  if (ctor && ctor === "Object") {
    typeName = ctor;
  }

  const valType = typeof val;
  const basicTypeName = valType === "function" || valType === "object" ? typeName : valType;

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

export function info(val: unknown): string {
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
export function isEmpty(val: unknown[]): val is [];
export function isEmpty(val: Record<Key, unknown>): val is Record<Key, never>;
export function isEmpty(val: Map<unknown, unknown>): val is Map<unknown, never>;
export function isEmpty(val: Set<unknown>): val is Set<never>;
export function isEmpty(val: WeakMap<object, unknown>): val is WeakMap<object, unknown>;
export function isEmpty(val: WeakSet<object>): val is WeakSet<object>;
export function isEmpty(val: unknown): boolean;
export function isEmpty(val: unknown): boolean {
  // Generic type checking
  // eslint-disable-next-line eqeqeq
  if (val == null || val === false || val === "") return true;

  // Number checking
  if (typeof val === "number") return val === 0 || Number.isNaN(val);

  // Array checking
  if (Array.isArray(val) && val.length === 0) return true;

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0; // size check works for these types
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
export function notEmpty(val: unknown[] | []): val is [unknown, ...unknown[]];
export function notEmpty(val: Record<Key, unknown>): val is Record<Key, unknown>;
export function notEmpty(val: Map<unknown, unknown>): val is Map<unknown, never>;
export function notEmpty(val: Set<unknown>): val is Set<never>;
export function notEmpty(val: WeakMap<object, unknown>): val is WeakMap<object, unknown>;
export function notEmpty(val: WeakSet<object>): val is WeakSet<object>;
export function notEmpty(val: unknown): boolean;
export function notEmpty(val: unknown): boolean {
  return !isEmpty(val);
}