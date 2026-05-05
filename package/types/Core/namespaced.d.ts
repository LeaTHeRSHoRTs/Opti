/* eslint-disable @typescript-eslint/no-explicit-any */

/** The `Func<T, A, R>` type represents a JavaScript function */
type Func<T = any, A extends any[] = any[], R = any> = (this: T, ...args: A) => R;

/**
 * The type-only `Func` namespace holds Function-related utility types, such as `Func.Arguments`, `Func.Return`, and `Func.This`
 */
declare namespace Func {
  /** Asynchronous function that returns a `Promise<T>` or  `PromiseLike<T>` */
  type Async<T = any, A extends any[] = any[], R = any> = Func<T, A, Promise<R> | PromiseLike<R>>;

  // Base Utilities

  /** Gets a function's argument list types */
  type Arguments<T extends Func> = Parameters<T>;

  /** Gets a function's return type */
  type Return<T extends Func> = ReturnType<T>;

  /** Gets a function's `this` argument type */
  type This<T extends Func> = ThisParameterType<T>;


  // Pre-made functions

  /** A function that takes an argument and returns a `boolean` */
  type Predicate<T> = Func<any, [T], boolean>;

  /** A function that takes an argument and returns nothing (`void`) */
  type Consumer<T> = Func<any, [T], void>;

  /** A function that takes no arguments and produces a value */
  type Supplier<T> = Func<any, [], T>;

  /** A function that takes a single argument and returns a value of the same type */
  type UnaryOperator<T> = Func<any, [T], T>;

  /** A function that takes two arguments of the same type and returns a single value */
  type BinaryOperator<T> = Func<any, [T, T], T>;


  // Async Versions of pre-made functions

  /** An async function that takes an argument and returns nothing (`void`) */
  type AsyncConsumer<T> = Func.Async<any, [T], void>;

  /** An async function that takes no arguments and produces a value */
  type AsyncSupplier<T> = Func.Async<any, [], T>;

  /** An async function that takes an argument and returns a `boolean` */
  type AsyncPredicate<T> = Func.Async<any, [T], boolean>;

  /** An async function that takes a single argument and returns a value of the same type */
  type AsyncUnaryOperator<T> = Func.Async<any, [T], T>;

  /** An async function that takes two arguments of the same type and returns a single value */
  type AsyncBinaryOperator<T> = Func.Async<any, [T, T], T>;
}


/** The `Class<I, A, Abs>` type represents a JavaScript object that has a constructor */
type Class<I = any, A extends any[] = any[], Abs extends boolean = false> = Abs extends true ? abstract new (...args: A) => I : new (...args: A) => I;

/**
 * The type-only `Class` namespace holds class-related utilities such as `Class.Constructor`, `Class.Constructable`, `Class.InstanceMethods` and `Class.StaticFields`
 */
declare namespace Class {
  /** Gets the instance type of a class */
  type Instance<T extends Class> = T extends Class<infer I, any[], boolean> ? I : never;

  /** A class that has a prototype */
  type Prototype = Class & { prototype: any };

  type Constructor<T extends Class = Class> = T extends Class<infer I, infer A, boolean> ? (this: void, ...args: A) => I : never;

  // Instance helpers
  type InstanceMethods<T extends Class> = T extends Class<infer I, any[], boolean> 
      ? { 
          [K in keyof I]: I[K] extends Func ? K : never 
        }[keyof I]
      : never;
  type InstanceFields<T extends Class> = T extends Class<infer I, any[], boolean> 
      ? { 
          [K in keyof I]: I[K] extends Func ? never : K 
        }[keyof I] & (string | symbol)
      : never;
  type InstanceProperties<T extends Class> = T extends Class<infer I, any[], boolean> ? keyof I : never;

  // Static helpers
  type StaticMethods<T extends Class> = { [K in keyof T]: T[K] extends Func ? K : never }[keyof T];
  type StaticFields<T extends Class> = { [K in keyof T]: T[K] extends Func ? never : K }[keyof T];
  type StaticProps<T extends Class> = keyof T;
}

/**
 * The Type-Only `Boolean` namespace holds Boolean-related utility types
 */
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

/**
 * The *Type-Only* `Tuple` namespace holds Tuple-related utility types 
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

declare namespace Number {
  type Increment<N extends number> = [...Tuple.Build<N>, unknown]['length']; 
  type Decrement<N extends number> = Tuple.Build<N> extends [infer _u, ...infer Rest] ? Rest['length'] : never;
}

declare namespace EventTarget {
  type Func<T, K extends keyof EventMapOf<T> = keyof EventMapOf<T>> = (this: T, e: EventMapOf<T>[K]) => void;
}

/**
 * 
 * ---
 * 
 * The Type-Only `CSS` namespace holds CSS-related utility types
 */
declare namespace CSS {
  type Object = Partial<Record<keyof CSSStyleDeclaration, string | number>>;

  type PropertyName = Exclude<keyof CSSStyleDeclaration, number | symbol>;

  type StyleDeclaration = CSSStyleDeclaration;
}