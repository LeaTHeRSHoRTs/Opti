/** 
 * The `Func<T, A, R>` type represents a JavaScript function
 * @opti
 * @since 1.0.0
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func<T = any, A extends _[] = any[], R = any> = (this: T, ...args: A) => R;

/** 
 * The type-only `Func` namespace holds Function-related utility types, such as `Func.Arguments`, 
 * `Func.Return`, and `Func.This`
 * @opti
 * @since 1.0.0
 */
declare namespace Func {
    /** 
     * Asynchronous function that returns a `Promise<T>` or  `PromiseLike<T>`
     * @opti
     * @since 1.0.0
     */
    type Async<T = _, A extends _[] = _[], R = _> = Func<T, A, Promise<R> | PromiseLike<R>>;

    // Base Utilities

    /** 
     * Gets a function's argument list types
     * @opti
     * @since 1.0.0
     */
    type Arguments<T extends Func> = Parameters<T>;

    /** 
     * Gets a function's return type
     * @opti
     * @since 1.0.0
     */
    type Return<T extends Func> = ReturnType<T>;

    /** 
     * Gets a function's `this` argument type
     * @opti
     * @since 1.0.0
     */
    type This<T extends Func> = ThisParameterType<T>;


    // Pre-made functions

    /** 
     * A function that takes an argument and returns a `boolean`
     * @opti
     * @since 1.0.0
     */
    type Predicate<T> = Func<_, [T], boolean>;

    /** 
     * A function that takes an argument and returns nothing (`void`)
     * @opti
     * @since 1.0.0
     */
    type Consumer<T> = Func<_, [T], void>;

    /** 
     * A function that takes no arguments and produces a value
     * @opti
     * @since 1.0.0
     */
    type Supplier<T> = Func<_, [], T>;

    /** 
     * A function that takes a single argument and returns a value of the same type
     * @opti
     * @since 1.0.0
     */
    type UnaryOperator<T> = Func<_, [T], T>;

    /** 
     * A function that takes two arguments of the same type and returns a single value
     * @opti
     * @since 1.0.0
     */
    type BinaryOperator<T> = Func<_, [T, T], T>;


    // Async Versions of pre-made functions

    /** 
     * An async function that takes an argument and returns nothing (`void`)
     * @opti
     * @since 1.0.0
     */
    type AsyncConsumer<T> = Func.Async<_, [T], void>;

    /** 
     * An async function that takes no arguments and produces a value
     * @opti
     * @since 1.0.0
     */
    type AsyncSupplier<T> = Func.Async<_, [], T>;

    /** 
     * An async function that takes an argument and returns a `boolean`
     * @opti
     * @since 1.0.0
     */
    type AsyncPredicate<T> = Func.Async<_, [T], boolean>;

    /** 
     * An async function that takes a single argument and returns a value of the same type
     * @opti
     * @since 1.0.0
     */
    type AsyncUnaryOperator<T> = Func.Async<_, [T], T>;

    /** 
     * An async function that takes two arguments of the same type and returns a single value
     * @opti
     * @since 1.0.0
     */
    type AsyncBinaryOperator<T> = Func.Async<_, [T, T], T>;
}

/** 
 * The `Class<I, A, Abs>` type represents a JavaScript object that has a constructor
 * @opti
 * @since 1.0.0
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Class<I = any, A extends _[] = any[], Abs extends boolean = false> = Abs extends true ? abstract new (...args: A) => I : new (...args: A) => I;

/** 
 * The type-only `Class` namespace holds class-related utilities such as `Class.Constructor`, 
 * `Class.Constructable`, `Class.InstanceMethods` and `Class.StaticFields`
 * @opti
 * @since 1.0.0
 */
declare namespace Class {
    /** 
     * Gets the instance type of a class
     * @opti
     * @since 1.0.0
     */
    type Instance<T extends Class> = T extends Class<infer I, _[], boolean> ? I : never;

    /** 
     * Represents a class that has a prototype
     * @opti
     * @since 1.0.0
     */
    type Prototype = Class & { prototype: _ };

    /** 
     * Represents a class constructor
     * @opti
     * @since 1.0.0
     */
    type Constructor<T extends Class = Class> = T extends Class<infer I, infer A, boolean> ? (this: void, ...args: A) => I : never;

    // Instance helpers

    /**
     * Collects all the instance methods of a class
     * @opti
     * @since 1.0.0
     */
    type InstanceMethods<T extends Class> = T extends Class<infer I, _[], boolean>
        ? {
            [K in keyof I]: I[K] extends Func ? K : never
        }[keyof I]
        : never;

    /**
     * Collects all the instance fields of a class
     * @opti
     * @since 1.0.0
     */
    type InstanceFields<T extends Class> = T extends Class<infer I, _[], boolean>
        ? {
            [K in keyof I]: I[K] extends Func ? never : K
        }[keyof I] & (string | symbol)
        : never;

    /**
     * Collects all the instance properties of a class
     * @opti
     * @since 1.0.0
     */
    type InstanceProps<T extends Class> = T extends Class<infer I, _[], boolean> ? keyof I : never;

    // Static helpers

    /**
     * Collects all the static methods of a class
     * @opti
     * @since 1.0.0
     */
    type StaticMethods<T extends Class> = { [K in keyof T]: T[K] extends Func ? K : never }[keyof T];

    /**
     * Collects all the static fields of a class
     * @opti
     * @since 1.0.0
     */
    type StaticFields<T extends Class> = { [K in keyof T]: T[K] extends Func ? never : K }[keyof T];

    /**
     * Collects all the static properties of a class
     * @opti
     * @since 1.0.0
     */
    type StaticProps<T extends Class> = keyof T;
}

/** 
 * The type-only `Boolean` namespace holds Boolean-related utility types
 * @opti
 * @since 1.0.0
 */
declare namespace Boolean {
    /**
     * Extracts all the falsy values from `T`
     * 
     * Broad types such as `string` and `number` are not narrowed
     * @opti
     * @since 1.0.0
     */
    type Falsy<T> =
        T extends false ? false :
            T extends '' ? '' :
                T extends 0 ? 0 | -0 :
                    T extends 0n ? 0n :
                        T extends null ? null :
                            T extends undefined ? undefined :
                                never;

    /**
     * Extracts all the truthy values from `T`
     * 
     * Broad types such as `string` and `number` are not narrowed
     * @opti
     * @since 1.0.0
     */
    type Truthy<T = string | number | boolean | object | symbol | null | undefined> = Exclude<T, Falsy<T>>;
}

/**
 * Constructs a tuple containing `L` elements of type `T`.
 *
 * Falls back to `T[]` when `L` exceeds the recursion limit of 40.
 * @opti
 * @since 1.0.0
 */
type Tuple<T, L extends number, R extends unknown[] = []> = R['length'] extends L
    ? R
    : R['length'] extends 40 // Limited because TS cannot handle high type instantiation
        ? T[]
        : Tuple<T, L, [T, ...R]>;

/** 
 * The type-only `Num` namespace holds Number-related utility types
 * @opti
 * @since 1.0.0
 */
declare namespace Num {
    /**
     * Increments a number specified by 1. Use only for number type literals, 
     * as the `number` type cannot be incremented meaningfully
     * @opti
     * @since 1.0.0
     */
    type Increment<N extends number> = [...Tuple<unknown, N>, unknown]['length'];

    /**
     * Increments a number specified by 1. Use only for number type literals, 
     * as the `number` type cannot be incremented meaningfully
     * @opti
     * @since 1.0.0
     */
    type Decrement<N extends number> = 
        Tuple<unknown, N> extends [infer _, ...infer Rest] 
            ? Rest['length']
            : never;
}

/** 
 * The type-only `Str` namespace holds String-related utility types
 * @opti
 * @since 1.0.0
 */
declare namespace Str {
    /** 
     * Supported case conventions for the `String.toCase` function
     * @opti 
     * @since 1.0.0
     */
    type Case = 'camel' | 'kebab' | 'pascal' | 'snake' | 'train' | 'dot';
}

/** 
 * The `Arr` type represents an array with at least one value or null
 * @opti
 * @since 1.0.0
 */
type Arr<T> = [T, ...T[]] | null;

/** 
 * The type-only `Arr` namespace holds Array-related utility types
 * @opti
 * @since 1.0.0
 */
declare namespace Arr {
    /** 
     * Flattens array types like `T[][]` and others
     * @opti
     * @since 1.0.0
     */
    type Flatten<T extends readonly unknown[]> =
        T extends readonly (infer U extends readonly unknown[])[]
            ? Arr.Flatten<U>
            : T;

    /**
     * Represents an array that has at least 1 value
     * @opti
     * @since 1.0.0
     */
    type Present<T = unknown> = [T, ...T[]];
}

/** 
 * The type-only `Obj` namespace holds Object-related utility types
 * @opti
 * @since 1.0.0
 */
declare namespace Obj {
    /**
     * Gets all the properties in the object `T`
     * @opti
     * @since 1.0.0
     */
    type Properties<T> = {
        [K in keyof T]: T[K] extends Func ? never : K;
    }[keyof T];

    /**
     * Gets all the getters in the object `T`
     * @opti
     * @since 1.0.0
     */
    type Getters<T> = {
        [K in keyof T]-?: T[K] extends Func ? never : (
            { -readonly [P in K]: T[K] } extends { [P in K]: T[K] } ? K : never
        )
    }[keyof T];

    /**
     * Gets all the setters in the object `T`
     * @opti
     * @since 1.0.0
     */
    type Setters<T> = {
        [K in keyof T]-?: T[K] extends Func ? never : (
            { -readonly [P in K]: T[K] } extends { [P in K]: T[P] } ? K : never
        )
    }[keyof T];

    /**
     * Gets all the writable properties in the object `T`\
     * @opti
     * @since 1.0.0
     */
    type Writable<T> = {
        [K in keyof T]-?:
        { -readonly [P in K]: T[K] } extends { [P in K]: T[K] } ? K : never
    }[keyof T];

    /**
     * Gets all the accessors in the object `T`
     * @opti
     * @since 1.0.0
     */
    type Accessor<T> = Getters<T> | Setters<T>;
}

/** 
 * The Type-Only `CSS` namespace holds CSS-related utility types
 * @opti
 * @since 1.0.0
 */
declare namespace CSS {
    /**
     * Represents a CSS object where all the keys are optional CSS properties, written in camelCase
     * @opti
     * @since 1.0.0
     */
    type Object = Partial<Record<keyof CSSStyleDeclaration, string | number>>;

    /**
     * Represents a CSS property name, in camelCase
     * @opti
     * @since 1.0.0
     */
    type PropertyName = Exclude<keyof CSSStyleDeclaration, number | symbol>;

    /**
     * Represents the raw CSSStyleDeclaration type
     * @opti
     * @since 1.0.0
     */
    type StyleDeclaration = CSSStyleDeclaration;
}