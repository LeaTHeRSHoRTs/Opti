declare namespace HTMLInputElement {
  interface ValueAccessor {
    /** Returns the value attribute as a string, or null otherwise */
    asString(): string;
    /** Returns the value attribute as a number, or null otherwise */
    asNumber(): number | null;
    /** Returns the value attribute as a boolean, or null otherwise */
    asBoolean(): boolean | null;
    /** Returns the value attribute as a Date object instance, or null otherwise */
    asDate(): Date | null;
    /** Returns the value attribute as a suitable type */
    inferred(): string | number | boolean | Date;
    /** Gets the inferred type of the value attribute */
    get type(): string;
  }
}

interface Opti {
  crafty: boolean;
  query: boolean;
  unsync: boolean;
  requests: boolean;
  flow: boolean;
}

interface BaseValueQueries<T> {
  getValue(): T;

  /**
   * 
   * @param other 
   */
  equalTo(other: unknown): boolean;
  /**
   * Checks if a value is in the format Object, Object(size), Date:time or Function:<name>(...params,)
   * @param str The type string to check
   */
  isTypeString(str: string): boolean;
  /**
   * Returns the type of the object in the format Object, Object(size), Date:time or Function:<name>(...params,)
   */
  stringOf(): string;
  isInstanceOf<U extends Class>(clazz: U): this is BaseValueQueries<Class.Instance<U>>;
  isDefined(): this is BaseValueQueries<NonNullable<T>>;
  isFalsy(): this is BaseValueQueries<Boolean.Falsy<T>>;
  isTruthy(): this is BaseValueQueries<Boolean.Truthy<T>>;
  isNull(): this is BaseValueQueries<null>;
  isUndefined(): this is BaseValueQueries<undefined>;
}

interface SizedObjectTesters<T> extends BaseValueQueries<T> {
  length<U extends number>(length: U): this is ValueQueries<T extends unknown[] ? Tuple.Of<T[number], U> : T & { length: U }>;
  longer(object: Sized): boolean;
  longer(length: number): boolean;
  shorter(length: number): boolean;
  shorter(object: Sized): boolean;
}

interface FuncTesters<T extends Func> extends BaseValueQueries<T> {
  isName(name: string): boolean;
}

type EventListenerInfo<T, K extends keyof EventMapOf<T> = keyof EventMapOf<T>> =
  | {
      type: K, 
      func: EventTarget.Func<T, K>,
      options: AddEventListenerOptions,
      listener: "default" | "controller",
      special?: undefined
    }
  | {
      type: K, 
      func: EventTarget.Func<T, K>,
      options: AddEventListenerOptions,
      listener: "conditional",
      special: ((this: T, e: EventMapOf<T>[K]) => boolean) | number
    };

interface RegistryOf<K, V> { 
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  setMultiple(obj: [K, V][]): void;
}