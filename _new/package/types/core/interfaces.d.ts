interface Opti {
    /**
     * Is true when Crafty is enabled via import
     * @opti
     * @since 1.0.0
     */
    crafty: boolean;

    /**
     * Is true when Query is enabled via import
     * @opti
     * @since 1.0.0
     */
    query: boolean;

    /**
     * Is true when Unsync is enabled via import
     * @opti
     * @since 1.0.0
     */
    unsync: boolean;

    /**
     * Is true when Request is enabled via import
     * @opti
     * @since 1.0.0
     */
    request: boolean;

    /**
     * Is true when Flow is enabled via import
     * @opti
     * @since 1.0.0
     */
    flow: boolean;
}

/**
 * The testing object returned by {@linkcode is}
 * @opti
 * @since 1.0.0
 */
type Is<T> = {
    /**
     * Returns the status of the operation
     * @opti
     * @since 1.0.0
     */
    get ok(): boolean;

    /**
     * Gets the value that is used in the verification
     * @opti
     * @since 1.0.0
     * @returns The value that was used in the construction of this object (the value used in the is(...) call)
     * @example
     * const isQuery = is("string");
     * console.log(isQuery.getValue()); // "string"
     */
    get(): T;

    /**
     * Checks whether the value is equal to `other`. For deep equality use {@linkcode Is.same}
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
    equal(other: unknown): boolean & Is<T>;

    /**
     * Checks whether the value is equal to `other` using deep equality
     * @opti
     * @since 1.0.0
     * @param other The value to compare against
     * @returns Whether the values are deeply equal
     * @example
     * 
     */
    same<U>(other: U): boolean & Is<U>;

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
    empty(): boolean & Is<T>;

    /**
     * Tests if the element is type `type`, where `type` is a value for the `typeof` check
     * @opti
     * @since 1.0.0
     * @param type The type to check. Must be a valid string that can be used in `typeof` checks
     * @returns 
     * @example
     */
    type<U extends Primitive>(type: U): Is<T & TypeOf<U>>;
} & IsForSized<T> & IsForNumber<T> & IsForDate<T>;


/**
 * {@linkcode Is} checks for sized objects (objects with a `length` or `size` property)
 * @opti
 * @since 1.0.0
 */
type IsForSized<T> = T extends Sized ? {
    /**
     * Checks whether the value is the same length or size as `length`
     * @opti
     * @since 1.0.0
     * @param size The size to check
     * @returns Whether the objects are the same size or not
     * @example
     */
    length<U extends number>(size: U): Is<T>;

    /**
     * Checks if the value is longer than the object provided
     * @opti
     * @since 1.0.0
     * @param object The object to test. Must have a `size` or `length` property
     * @returns Whether the value is shorter than `object`
     * @example
     */
    bigger(object: Sized): Is<T>;

    /**
     * Checks if the value is longer than `size`
     * @opti
     * @since 1.0.0
     * @param size A number used to check the size
     * @returns Whether the value is longer than `size`
     * @example
     */
    bigger(size: number): Is<T>;

    /**
     * Checks if the value is shorter than the object provided
     * @opti
     * @since 1.0.0
     * @param object The object to test. Must have a `size` or `length` property
     * @returns Whether the value is shorter than `object`
     * @example
     */
    smaller(object: Sized): Is<T>;

    /**
     * Checks if the value is shorter than `size`
     * @opti
     * @since 1.0.0
     * @param size A number used to check the size
     * @returns Whether the value is shorter than `size`
     * @example
     */
    smaller(size: number): Is<T>;
} : {};

/**
 * {@linkcode Is} checks for numbers
 * @opti
 * @since 1.0.0
 */
type IsForNumber<T> = T extends number ? {
    /**
     * Checks if the value is longer than `value`
     * @opti
     * @since 1.0.0
     * @param num The number to check against the value
     * @returns Whether the value is bigger than the specified number
     * @example
     */
    bigger<U extends number>(num: U): Is<T>;

    /**
     * Checks if the value is shorter than `value`
     * @opti
     * @since 1.0.0
     * @param num The number to check against the value
     * @returns Whether the value is smaller than the specified number
     * @example
     */
    smaller(num: number): Is<T>;
} : {};

/**
 * {@linkcode Is} checks for `Date` objects
 * @opti
 * @since 1.0.0
 */
type IsForDate<T> = T extends Date ? {
    /**
     * Checks if the value is before a `Date` object's timestamp
     * @opti
     * @since 1.0.0
     * @param date The date object to check against the value
     * @returns Whether the provided date is before the value
     * @example
     */
    before(date: Date): Is<T>;

    /**
     * Checks if the value is before a number of milliseconds since January 1, 1970, UTC
     * @opti
     * @since 1.0.0
     * @param time The time in ms to check against the value
     * @returns Whether the provided time is before the value
     * @example
     */
    before(time: number): Is<T>;
    
    /**
     * Checks if the value is before the current time
     * @opti
     * @since 1.0.0
     * @param now The string literal `'now'`
     * @returns Whether the provided date is before the current time
     * @example
     */
    before(now: 'now'): Is<T>;

    /**
     * Checks if the value is after a `Date` object's timestamp
     * @opti
     * @since 1.0.0
     * @param date The date object to check against the value
     * @returns Whether the provided date is after the value
     * @example
     */
    after(date: Date): Is<T>;

    /**
     * Checks if the value is after a number of milliseconds since January 1, 1970, UTC
     * @opti
     * @since 1.0.0
     * @param time The time in ms to check against the value
     * @returns Whether the provided time is after the value
     * @example
     */
    after(time: number): Is<T>;

    /**
     * Checks if the value is after the current time
     * @opti
     * @since 1.0.0
     * @param now The string literal `'now'`
     * @returns Whether the provided date is after the current time
     * @example
     */
    after(now: 'now'): Is<T>;
} : {};

interface RegistryOf<K, V> {
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    has(key: K): boolean;
    setMultiple(obj: [K, V][]): void;
}

/**
 * The interface for all of the possible options for element copying
 * @opti
 * @since 1.0.0
 */
interface ElementCopyOptions {
    /**
     * Defines if the new element should have everything that the previous element had. Defaults to `false`.
     * @opti
     * @since 1.0.0
     */
    copyAll?: boolean;
    /**
     * Defines if the new element should have the same event listeners. Defaults to `false`.
     * @opti
     * @since 1.0.0
     */
    copyEvents?: boolean;
    /**
     * Defines if the new element should have the same children. Defaults to `false`.
     * 
     * If `copyAttributes` is set to `true`, this property is also set to `true`, 
     * regardless of whether this property is set to `false` or not
     * @opti
     * @since 1.0.0
     */
    copyChildren?: boolean;
    /**
     * Defines if the new element should have the same attributes. Defaults to `true`.
     * @opti
     * @since 1.0.0
     */
    copyAttributes?: boolean;
    /**
     * Defines if the new element should have the same styles. Defaults to `true`.
     * 
     * If `copyAttributes` is set to `true`, this property is also set to `true`, 
     * regardless of whether this property is set to `false` or not
     * @opti
     * @since 1.0.0
     */
    copyStyles?: boolean;

    /** 
     * The fallback ID to use if the copied element has an ID
     * @opti
     * @since 1.0.0
     */
    fallbackId?: string;
}

/**
 * The interface for the input element's `val` property
 * @opti
 * @since 1.0.0
 */
interface InputValueAccessor {
    /**
     * Returns the input's value as a string.
     * @opti
     * @since 1.0.0
     * @returns The input's value as a string
     * @example
     * const input = document.$("form > input#target");
     * console.log(input.val.asString());
     */
    asString(): string;

    /**
     * Returns the input's value as a number, or `null` if it cannot be parsed as a valid number.
     * @opti
     * @since 1.0.0
     * @returns The parsed number, or `null` if the value is invalid.
     * @example
     * const input = document.$("form > input#target");
     * console.log(input.val.asString());
     */
    asNumber(): number | null;

    /**
     * Returns the input's value as a boolean using JavaScript truthiness.
     * Every value is converted to either `true` or `false`; no value is considered invalid.
     * @opti
     * @since 1.0.0
     * @returns The input's value converted to a boolean.
     * @example
     * const input = document.$("form > input#target");
     * console.log(input.val.asString());
     */
    asBoolean(): boolean;

    /**
     * Returns the input's value as a `Date`, or `null` if  it cannot  be parsed as a valid date
     * does not conform to a valid date string
     * @opti
     * @since 1.0.0
     * @returns The parsed date, or `null` if the value is invalid.
     * @example
     * const input = document.$("form > input#target");
     * console.log(input.val.asDate());
     */
    asDate(): Date | null;

    /**
     * Returns the input's value converted to the type inferred from its format.
     * Falls back to a string if no other supported type can be inferred.
     * @opti
     * @since 1.0.0
     * @returns The value converted to an inferred type.
     * @example
     * const input = document.$("form > input#target");
     * console.log(input.val.inferred()); // If input.value is "3", returns the number 3
     */
    inferred(): string | number | boolean | Date;

    /**
     * Returns the inferred type of the input's value, using type names that differ from those returned by `typeof`.
     * @opti
     * @since 1.0.0
     * @returns The input element's type.
     * @example
     * const input = document.$("form > input#target");
     * console.log(input.val.type); // "text", "number", "date", etc.
     */
    get type(): 'string' | 'number' | 'date' | 'boolean';
}