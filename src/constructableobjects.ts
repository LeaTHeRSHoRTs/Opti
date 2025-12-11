export function Tuple<T extends unknown[]>(...values: T) {
  return values;
}

export function Enum<T extends readonly string[]>(...values: T): any {
  const obj = {} as { [K in T[number]]: symbol };

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

function deepFreeze<T>(obj: T): Readonly<T> {
  // Only freeze objects or arrays
  if (obj && typeof obj === "object") {
    Object.getOwnPropertyNames(obj).forEach((prop) => {
      const value = (obj as any)[prop];
      // Recursively freeze nested objects
      if (value && typeof value === "object" && !Object.isFrozen(value)) {
        deepFreeze(value);
      }
    });
    return Object.freeze(obj) as Readonly<T>;
  }
  return obj;
}

export class Collection<T> implements ArrayLike<T> {
  private items: T[];
  readonly [key: number]: T;

  private constructor(items?: T[]) {
    this.items = items ?? [];
  }

  get length(): number {
    return this.items.length;
  }

  public static from<T>(arrayLike: ArrayLike<T>) {
    return new Collection<T>(Array.from(arrayLike));
  }

  public static of<T extends unknown[]>(...values: T) {
    return new Collection<T[number]>(values);
  }

  /**
   * @throws {CollectionOutOfBoundsException} The index does not exist
   */
  item(index: number): T {
    const item = this.items[index];

    if (!item) throw new CollectionOutOfBoundsException("index " + index + " does not exist on this collection");

    return this.items[index];
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

  toArray(): T[] {
    return this.items;
  }

  toReadonlyArray(): readonly T[] {
    return deepFreeze([...this.items]);
  }
}