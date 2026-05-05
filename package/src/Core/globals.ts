function typeObject<T>(val: T, str: string): ValueQueries<T> {
  const v: T = val;
  let obj: ValueQueries<T> = Object.create({
    getValue() { return val; },
    stringOf() { return str; },
    equalTo(other: unknown): boolean {
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
          const regex = /<([\w$_0-9]+)>\((\d+)\)/;
          const match = str.match(regex);

          if (match) {
            const [, name, argsStr] = match;
            const args = Number(argsStr);

            if (Number.isNaN(args)) {
              throw new TypeException(`Internal type matching error: ${argsStr} is not a number.`);
            } else if (!Number.isFinite(args)) {
              throw new TypeException(`Internal type matching error: ${argsStr} is infinite.`);
            }

            return name === (other.name || "anonymous") && args === other.length;
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
    isInstanceOf<U extends Class>(clazz: U): this is BaseValueQueries<Class.Instance<U>> {
      if (v === null || v === undefined) return false;
      return Object(v) instanceof clazz;
    },
    isDefined(): this is BaseValueQueries<NonNullable<T>> {
      return v !== undefined && v !== null;
    },
    isFalsy(): this is BaseValueQueries<Boolean.Falsy<T>> {
      return !Boolean(v);
    },
    isTruthy(): this is BaseValueQueries<Boolean.Truthy<T>> {
      return Boolean(v);
    },
    isNull(): this is BaseValueQueries<null> {
      return v === null;
    },
    isUndefined(): this is BaseValueQueries<undefined> {
      return v === undefined;
    },
    isTypeString(typestr: string) {
      return typestr === str;
    }
  } satisfies BaseValueQueries<T>);

  function hasOwn<U extends string>(intVal: T, prop: U): intVal is typeof intVal & { [K in U]: number } {
    if (intVal === null || intVal === undefined) {
      return false;
    }

    if (typeof intVal === "string") return true;
    return Object.prototype.hasOwnProperty.call(intVal, prop);
  }

  if (typeof v === "string" || hasOwn(v, "size") || hasOwn(v, "length")) {
    obj = Object.assign(obj, {
      shorter(lengthOrObject: number | Sized): boolean {
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
      longer(lengthOrObject: number | Sized): boolean {
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

      length<U extends number>(length: U): this is ValueQueries<T extends unknown[] ? Tuple.Of<T[number], U> : T & { length: U }> {
        if (hasOwn(v, "size") && typeof v.size === "number") {
          return v.size === length;
        } else if (hasOwn(v, "length") && typeof v.length === "number") {
          return v.length === length;
        }
        return false;
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

export function is<T>(val: T): ValueQueries<T> {
  if (val === null) return typeObject<T>(val, "null");
  if (val === undefined) return typeObject<T>(val, "undefined");
  if (typeof val === "function") return typeObject(val, `Function:${val.name || "<anonymous>"}(${val.length})`);

  let typeName = Object.prototype.toString.call(val).slice(8, -1);
  typeName = (typeName[0]?.toUpperCase() ?? "") + typeName.slice(1);

  const ctor = val.constructor.name;
  if (ctor && ctor === "Object") {
    typeName = ctor;
  }

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

  return typeObject<T>(val, typeName);
};

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