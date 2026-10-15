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

declare namespace HTMLInputElement {
    interface ValueAccessor {
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
}

/**
 * Common value queries for all values that have been used in a {@linkcode is} call
 * @opti
 * @since 1.0.0
 */
interface BaseValueQueries<T> {
    /**
     * Gets the value that is used in the verification
     * @opti
     * @since 1.0.0
     * @returns The value that was used in the construction of this object (the value used in the is(...) call)
     * @example
     * const isQuery = is("twelve");
     * console.log(isQuery.getValue()); // "twelve"
     */
    getValue(): T;

    /**
     * Returns a boolean indicating whether the value  is equal to `other`
     * @opti
     * @since 1.0.0
     * @param other The value to compare with the internal value
     * @returns A boolean representing whether the two values match
     * @example
     *
     */
    equal(other: unknown): boolean;

    /**
     * Checks whether the type T is empty (Emptiness is based off of the {@linkcode isEmpty} function)
     * @opti
     * @since 1.0.0
     * @returns A boolean representing whether the value is empty or not
     */
    empty(): boolean;

    /**
     * 
     * @opti
     * @since 1.0.0
     * @param type 
     */
    type<U extends Primitive>(type: U): this is ValueQueries<T & TypeOf<U>>;
}

interface SizedObjectTesters<T> extends BaseValueQueries<T> {
    length<U extends number>(length: U): this is ValueQueries<T extends unknown[] ? Tuple<T[number], U> : T & { length: U }>;

    /**
     * Checks if the value is longer than the object provided
     * @opti
     * @since 1.0.0
     * @param object The object to test. Must have a `size` or `length` property
     * @returns A boolean value that represents whether the object is shorter than the value
     */
    longer(object: Sized): boolean;

    /**
     * Checks if the value is longer than `length`
     * @opti
     * @since 1.0.0
     * @param length A number used to check the length
     * @returns A boolean value that represents whether the object is longer than `length`
     */
    longer(length: number): boolean;
    shorter(length: number): boolean;
    shorter(object: Sized): boolean;
}

interface RegistryOf<K, V> { 
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    has(key: K): boolean;
    setMultiple(obj: [K, V][]): void;
}

declare interface ElementCopyOptions {
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