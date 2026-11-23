/// <reference path="flow.d.ts" />

interface Flow {
    /**
     * Checks whether a value is unusable
     * @opti
     * @since 1.0.0
     * @param val The value to check
     * @returns Whether the value is usable
     * @example
     * const isUsable = Flow.flows(document.attachEvent);
     * 
     * if (isUsable) {
     *   console.log("Can use document.attachEvent!");
     * }
     */
    flows(val: unknown): boolean;

    /**
     * Returns a value that is either the original value or a fallback if the original value is unusable
     * @opti
     * @since 1.0.0
     * @param val The value to check
     * @param flowback The fallback to use if the check fails
     * @returns 
     * @example
     */
    always<T>(val: T, flowback: NonNullable<T>): [T, boolean];

<<<<<<< HEAD
=======
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
>>>>>>> e8c1144de0764c6c733618f56577c7d634f73a00
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

export const Flow: Flow;