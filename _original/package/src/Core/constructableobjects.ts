export function Tuple<T extends unknown[]>(...values: T): T {
  return values;
}

export function Enum<T extends readonly string[]>(...values: T): EnumInstance<T> {
  const obj = {} as EnumInstance<T>;

  values.forEach((val) => {
    const key = String(val);

    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) {
      throw new SyntaxException("Enum values must be defined and may only be the characters A-Z, a-z, 0-9, _ and $");
    } else if (Object.prototype.hasOwnProperty.call(obj, key)) {
      throw new SyntaxException("Enum members may only be unique");
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
    value: function*(): IterableIterator<T[number]> {
      for (const val of values) {
        yield val;
      }
    },
  });

  return obj;
}