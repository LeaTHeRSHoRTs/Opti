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
}

export const Flow: Flow;