/**
 * @opti
 */
interface ElementNode {
  tag: HTMLTag;
  class?: string;
  text?: string;
  html?: string;
  style?: Record<string, string | number>;
  children?: ElementNode | ElementNode[];
  [key: string]:
  | string
  | number
  | Record<string, string | number>
  | ElementNode
  | ElementNode[]
  | undefined;
}

interface ValueAccessor {
  asString(): string;
  asNumber(): number | null;
  asBoolean(): boolean | null
  asDate(): Date | null
}

interface Opti {
  crafty: boolean,
  query: boolean,
  unsync: boolean,
  requests: boolean,
  flow: boolean
}

interface BaseTypeOperators<T> {
  get value(): T;
  is(other: unknown): boolean;
  /**
   * Checks if a value is in the format Object, Object(size), Date:time or Function:<name>(...params,)
   * @param str The type string to check
   */
  isTypeString(str: string): boolean;
  /**
   * Returns the type of the object in the format Object, Object(size), Date:time or Function:<name>(...params,)
   */
  stringOf(): string;
  /**
   * Returns the type of object as a string without extra data
   */
  stringOfBasic(): string;
  isInstanceOf<U extends Class>(clazz: U): this is BaseTypeOperators<Class.Instance<U>>;
  isTypeOf<U extends Primitive>(type: U): this is TypeGuard<TypeOf<U>>;
  isDefined(): this is BaseTypeOperators<NonNullable<T>>;
  isFalsy(): this is BaseTypeOperators<Falsy<T>>;
  isTruthy(): this is BaseTypeOperators<Truthy<T>>;
  isNull(): this is BaseTypeOperators<null>;
  isUndefined(): this is BaseTypeOperators<undefined>;
  alwaysDefined<U>(orElse: U): asserts this is BaseTypeOperators<Exclude<T | U, undefined>>;
  alwaysTruthy<U>(truthy: Truthy<U>): asserts this is BaseTypeOperators<Truthy<T | U>>;
}

interface SizedObjectTesters<T> extends BaseTypeOperators<T> {
  isLength<U extends number>(length: U): this is TypeGuard<T extends unknown[] ? TupleOf<T[number], U> : T & { length: U }>;
  isLonger(object: Sized): boolean;
  isLonger(length: number): boolean;
  isShorter(length: number): boolean;
  isShorter(object: Sized): boolean;
}

interface ArrayTesters<T extends unknown[]> extends SizedObjectTesters<T> {
  //isLength<U extends number>(length: U): this is TypeGuard<TupleOf<T[number], U>>;
  alwaysContainsValues<U extends T[number]>(values: [U, ...U[]]): asserts this is TypeGuard<[U, ...U[]]> | TypeGuard<T>;
  containsValues<U extends T[number]>(countNullish?: boolean): this is TypeGuard<[U, ...U[]]>
}

interface FuncTesters<T extends Func> extends BaseTypeOperators<T> {
  isName(name: string): boolean;
}

type EventListenerInfo<T, K extends keyof EventMapOf<T> = keyof EventMapOf<T>> =
  | {
      type: K, 
      func: EventFunc<T, K>;
      options: AddEventListenerOptions;
      listener: "default" | "controller";
      special?: undefined;
    }
  | {
      type: K, 
      func: EventFunc<T, K>;
      options: AddEventListenerOptions;
      listener: "conditional";
      special: ((this: T, e: EventMapOf<T>[K]) => boolean) | number;
    };

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

interface PrototypeObject<T> {
  readonly prototype: T;
}