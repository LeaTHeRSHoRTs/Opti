/// <reference path="flow.d.ts" />

interface Flow {
    /**
     * Checks whether a value is unusable
     * @opti
     * @param val The value to check
     */
    flows(val: unknown): boolean;

    /**
     * Returns a value that is either the original value or a fallback if the original value is unusable
     * @opti
     * @param val The value to check
     * @param flowback The fallback to use if the check fails
     */
    always<T>(val: T, flowback: NonNullable<T>): [T, boolean];

    /**
     * Refines a value, returning null if the refinement failed or a backup value otherwise
     * @opti
     * @since 1.0.0
     * @param val The value which is being refined
     * @returns A refiner object that can be chained repeatedly
     * @example
     * 
     */
    when<T>(val: T): When<T>;
}

/**
 * The testing object returned by {@linkcode when}
 * @opti
 * @since 1.0.0
 */
type When<T> = {
    /**
     * Gets the value that is used in the verification
     * @opti
     * @since 1.0.0
     * @param fallback The fallback value to use instead of returning null
     * @returns The value that was used in the construction of this object (the value used in the is(...) call)
     * @example
     * const isQuery = is("string");
     * console.log(isQuery.get()); // "string"
     */
    give<U = null>(fallback?: U): T | null;

    /**
     * Checks whether the value is equal to `other`. For deep equality use {@linkcode When.same}
     * @opti
     * @since 1.0.0
     * @param other The value to compare against
     * @returns Whether the value are equal
     * @example
     * if (is("string").equal("string")) {
     *   console.log("The strings are equal"); // Gets to this branch
     * } else {
     *   console.log("The strings are not equal");
     * }
     */
    equal(other: unknown): When<T>;

    /**
     * Checks whether the value is equal to `other` using deep equality
     * @opti
     * @since 1.0.0
     * @param other The value to compare against
     * @returns Whether the values are deeply equal
     * @example
     * 
     */
    same<U>(other: U): When<U>;

    /**
     * Checks whether the type T is empty (Emptiness is based off of the {@linkcode isEmpty} function)
     * @opti
     * @since 1.0.0
     * @returns A boolean representing whether the value is empty or not
     * @example
     * if (is("").empty()) {
     *   console.log("The string is empty"); // Gets to this branch
     * } else {
     *   console.log("The string is not empty");
     * }
     */
    empty(): When<T>;

    /**
     * Tests if the element is type `type`, where `type` is a value for the `typeof` check
     * @opti
     * @since 1.0.0
     * @param type The type to check. Must be a valid string that can be used in `typeof` checks
     * @returns 
     * @example
     * if (is("str").type('str').ok) {
     *   console.log("The value is a string!")
     * }
     */
    type<U extends Primitive>(type: U): When<T & TypeOf<U>>;
} & WhenForSized<T> & WhenForNumber<T> & WhenForDate<T>;


/**
 * {@linkcode When} checks for sized objects (objects with a `length` or `size` property)
 * @opti
 * @since 1.0.0
 */
type WhenForSized<T> = T extends Sized ? {
    /**
     * Checks whether the value is the same length or size as `length`
     * @opti
     * @since 1.0.0
     * @param size The size to check
     * @returns Whether the objects are the same size or not
     * @example
     */
    length<U extends number>(size: U): When<T>;

    /**
     * Checks if the value is longer than the object provided
     * @opti
     * @since 1.0.0
     * @param object The object to test. Must have a `size` or `length` property
     * @returns Whether the value is shorter than `object`
     * @example
     */
    bigger(object: Sized): When<T>;

    /**
     * Checks if the value is longer than `size`
     * @opti
     * @since 1.0.0
     * @param size A number used to check the size
     * @returns Whether the value is longer than `size`
     * @example
     */
    bigger(size: number): When<T>;

    /**
     * Checks if the value is shorter than the object provided
     * @opti
     * @since 1.0.0
     * @param object The object to test. Must have a `size` or `length` property
     * @returns Whether the value is shorter than `object`
     * @example
     */
    smaller(object: Sized): When<T>;

    /**
     * Checks if the value is shorter than `size`
     * @opti
     * @since 1.0.0
     * @param size A number used to check the size
     * @returns Whether the value is shorter than `size`
     * @example
     */
    smaller(size: number): When<T>;
} : {};

/**
 * {@linkcode When} checks for numbers
 * @opti
 * @since 1.0.0
 */
type WhenForNumber<T> = T extends number ? {
    /**
     * Checks if the value is longer than `value`
     * @opti
     * @since 1.0.0
     * @param num The number to check against the value
     * @returns Whether the value is bigger than the specified number
     * @example
     */
    bigger<U extends number>(num: U): When<T>;

    /**
     * Checks if the value is shorter than `value`
     * @opti
     * @since 1.0.0
     * @param num The number to check against the value
     * @returns Whether the value is smaller than the specified number
     * @example
     */
    smaller(num: number): When<T>;
} : {};

/**
 * {@linkcode When} checks for `Date` objects
 * @opti
 * @since 1.0.0
 */
type WhenForDate<T> = T extends Date ? {
    /**
     * Checks if the value is before a `Date` object's timestamp
     * @opti
     * @since 1.0.0
     * @param date The date object to check against the value
     * @returns Whether the provided date is before the value
     * @example
     */
    before(date: Date): When<T>;

    /**
     * Checks if the value is before a number of milliseconds since January 1, 1970, UTC
     * @opti
     * @since 1.0.0
     * @param time The time in ms to check against the value
     * @returns Whether the provided time is before the value
     * @example
     */
    before(time: number): When<T>;
    
    /**
     * Checks if the value is before the current time
     * @opti
     * @since 1.0.0
     * @param now The string literal `'now'`
     * @returns Whether the provided date is before the current time
     * @example
     */
    before(now: 'now'): When<T>;

    /**
     * Checks if the value is after a `Date` object's timestamp
     * @opti
     * @since 1.0.0
     * @param date The date object to check against the value
     * @returns Whether the provided date is after the value
     * @example
     */
    after(date: Date): When<T>;

    /**
     * Checks if the value is after a number of milliseconds since January 1, 1970, UTC
     * @opti
     * @since 1.0.0
     * @param time The time in ms to check against the value
     * @returns Whether the provided time is after the value
     * @example
     */
    after(time: number): When<T>;

    /**
     * Checks if the value is after the current time
     * @opti
     * @since 1.0.0
     * @param now The string literal `'now'`
     * @returns Whether the provided date is after the current time
     * @example
     */
    after(now: 'now'): When<T>;
} : {};

export const Flow: Flow;