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