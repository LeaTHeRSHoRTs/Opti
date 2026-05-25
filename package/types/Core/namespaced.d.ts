/** The `Func<T, A, R>` type represents a JavaScript function */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func<T = any, A extends _[] = any[], R = any> = (this: T, ...args: A) => R;

/** The type-only `Func` namespace holds Function-related utility types, such as `Func.Arguments`, `Func.Return`, and `Func.This` */
declare namespace Func {
  /** Asynchronous function that returns a `Promise<T>` or  `PromiseLike<T>` */
  type Async<T = _, A extends _[] = _[], R = _> = Func<T, A, Promise<R> | PromiseLike<R>>;

  // Base Utilities

  /** Gets a function's argument list types */
  type Arguments<T extends Func> = Parameters<T>;

  /** Gets a function's return type */
  type Return<T extends Func> = ReturnType<T>;

  /** Gets a function's `this` argument type */
  type This<T extends Func> = ThisParameterType<T>;


  // Pre-made functions

  /** A function that takes an argument and returns a `boolean` */
  type Predicate<T> = Func<_, [T], boolean>;

  /** A function that takes an argument and returns nothing (`void`) */
  type Consumer<T> = Func<_, [T], void>;

  /** A function that takes no arguments and produces a value */
  type Supplier<T> = Func<_, [], T>;

  /** A function that takes a single argument and returns a value of the same type */
  type UnaryOperator<T> = Func<_, [T], T>;

  /** A function that takes two arguments of the same type and returns a single value */
  type BinaryOperator<T> = Func<_, [T, T], T>;


  // Async Versions of pre-made functions

  /** An async function that takes an argument and returns nothing (`void`) */
  type AsyncConsumer<T> = Func.Async<_, [T], void>;

  /** An async function that takes no arguments and produces a value */
  type AsyncSupplier<T> = Func.Async<_, [], T>;

  /** An async function that takes an argument and returns a `boolean` */
  type AsyncPredicate<T> = Func.Async<_, [T], boolean>;

  /** An async function that takes a single argument and returns a value of the same type */
  type AsyncUnaryOperator<T> = Func.Async<_, [T], T>;

  /** An async function that takes two arguments of the same type and returns a single value */
  type AsyncBinaryOperator<T> = Func.Async<_, [T, T], T>;
}

/** The `Class<I, A, Abs>` type represents a JavaScript object that has a constructor */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Class<I = any, A extends _[] = any[], Abs extends boolean = false> = Abs extends true ? abstract new (...args: A) => I : new (...args: A) => I;

/** The type-only `Class` namespace holds class-related utilities such as `Class.Constructor`, `Class.Constructable`, `Class.InstanceMethods` and `Class.StaticFields` */
declare namespace Class {
  /** Gets the instance type of a class */
  type Instance<T extends Class> = T extends Class<infer I, _[], boolean> ? I : never;

  /** A class that has a prototype */
  type Prototype = Class & { prototype: _ };

  type Constructor<T extends Class = Class> = T extends Class<infer I, infer A, boolean> ? (this: void, ...args: A) => I : never;

  // Instance helpers
  type InstanceMethods<T extends Class> = T extends Class<infer I, _[], boolean> 
      ? { 
          [K in keyof I]: I[K] extends Func ? K : never 
        }[keyof I]
      : never;
  type InstanceFields<T extends Class> = T extends Class<infer I, _[], boolean> 
      ? { 
          [K in keyof I]: I[K] extends Func ? never : K 
        }[keyof I] & (string | symbol)
      : never;
  type InstanceProperties<T extends Class> = T extends Class<infer I, _[], boolean> ? keyof I : never;

  // Static helpers
  type StaticMethods<T extends Class> = { [K in keyof T]: T[K] extends Func ? K : never }[keyof T];
  type StaticFields<T extends Class> = { [K in keyof T]: T[K] extends Func ? never : K }[keyof T];
  type StaticProps<T extends Class> = keyof T;
}

/** The type-only `Boolean` namespace holds Boolean-related utility types */
declare namespace Boolean {
  type Falsy<T> =
    T extends false ? false :
    T extends "" ? "" :
    T extends 0 ? 0 | -0 :
    T extends 0n ? 0n :
    T extends null ? null :
    T extends undefined ? undefined :
    never;

  type Truthy<T = string | number | boolean | object | symbol | null | undefined> = Exclude<T, Falsy<T>>;
}

type Tuple<T, L extends number, R extends unknown[] = []> = R['length'] extends L
  ? R
  : R['length'] extends 40 // Higher limit for modern TS
    ? T[] 
    : Tuple<T, L, [T, ...R]>;

/**
 * The type-only `Tuple` namespace holds Tuple-related utility types 
 * 
 * ---
 * 
 * The Tuple function.
 */
declare namespace Tuple {
  type Of<T, N extends number, R extends unknown[] = []> =
    R['length'] extends N
      ? R
      : R['length'] extends 20 
        ? T[] 
        : Tuple.Of<T, N, [T, ...R]>;

  type Build<L extends number, T extends unknown[] = []> = 
    T['length'] extends L ? T : Tuple.Build<L, [unknown, ...T]>;
}

/** The type-only `Number` namespace holds Number-related utility types */
declare namespace Number {
  type Increment<N extends number> = [...Tuple.Build<N>, unknown]['length']; 
  type Decrement<N extends number> = Tuple.Build<N> extends [infer _u, ...infer Rest] ? Rest['length'] : never;
}

/** The type-only `EventTarget` namespace holds EventTarget-related utility types */
declare namespace EventTarget {
  type Func<T, K extends keyof EventMapOf<T> = keyof EventMapOf<T>> = (this: T, e: EventMapOf<T>[K]) => void;
}

/** The type-only `String` namespace holds String-related utility types */
declare namespace String {
  /** Supported case conventions for the `String.toCase` function */
  type Case = "camel" | "kebab" | "pascal" | "snake" | "train" | "dot";
}

/** The type-only `Array` namespace holds Array-related utility types */
declare namespace Array {
  /** Flattens array types like `T[][]` and others */
  type Flatten<T extends readonly unknown[]> =
    T extends readonly (infer U extends readonly unknown[])[]
    ? Array.Flatten<U>
    : T;
}

/** The type-only `Object` namespace holds Object-related utility types */
declare namespace Object {
  type Properties<T> = {
    [K in keyof T]: T[K] extends Func ? never : K;
  }[keyof T];

  type Getters<T> = {
    [K in keyof T]-?: T[K] extends Func ? never : (
      { -readonly [P in K]: T[K] } extends { [P in K]: T[K] } ? K : never
    )
  }[keyof T];

  type Setters<T> = {
    [K in keyof T]-?: T[K] extends Func ? never : (
      { -readonly [P in K]: T[K] } extends { [P in K]: T[P] } ? K : never
    )
  }[keyof T];

  type Writable<T> = {
    [K in keyof T]-?:
    { -readonly [P in K]: T[K] } extends { [P in K]: T[K] } ? K : never
  }[keyof T];

  type Accessor<T> = Getters<T> | Setters<T>;
}

/** The Type-Only `CSS` namespace holds CSS-related utility types */
declare namespace CSS {
  type Object = Partial<Record<keyof CSSStyleDeclaration, string | number>>;

  type PropertyName = Exclude<keyof CSSStyleDeclaration, number | symbol>;

  type StyleDeclaration = CSSStyleDeclaration;
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

    /** 
     * The fallback ID to use if the copied element has an ID
     * 
     * This attribute never has a default value
     */
    fallbackId?: string;
  }

  /**
   * @opti
   */
  interface Props {
    id?: string;
    class?: string;
    text?: string;
    html?: string;
    style?: Record<string, string | number>;
    data?: Record<string, string | number>;
  }
}

type Arr<T> = [T, ...T[]] | null;
declare namespace Arr {
  type Present<T = unknown> = [T, ...T[]];
}