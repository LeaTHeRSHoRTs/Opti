declare namespace HTMLInputElement {
  interface ValueAccessor {
    asString(): string;
    asNumber(): number | null;
    asBoolean(): boolean | null;
    asDate(): Date | null;
    inferred(): string | number | boolean | Date;
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

declare namespace Element {
  interface CopyOptions {
    /**
     * Defines if the new element should have everything that the previous element had. Defaults to `false`.
     */
    copyAll?: boolean;
    /**
     * Defines if the new element should have the same event listeners. Defaults to `false`.
     */
    copyEvents?: boolean;
    /**
     * Defines if the new element should have the same children. Defaults to `false`.
     * 
     * If `copyAttributes` is set to true, this property is also set to true
     */
    copyChildren?: boolean;
    /**
     * Defines if the new element should have the same attributes. Defaults to `true`.
     */
    copyAttributes?: boolean;
    /**
     * Defines if the new element should have the same styles. Defaults to `true`.
     * 
     * If `copyAttributes` is set to true, this property is also set to true
     */
    copyStyles?: boolean;
  }

  /**
   * @opti
   */
  interface NodeObject {
    tag: HTMLTag;
    class?: string;
    text?: string;
    html?: string;
    style?: Record<string, string | number>;
    children?: NodeObject | NodeObject[];
    [key: string]:
    | string
    | number
    | Record<string, string | number>
    | NodeObject
    | NodeObject[]
    | undefined;
  }
}