import 'vitest';

declare module "vitest" {
    interface Assertion {
        /**
         *
         * @param a
         * @param b
         * @example
         */
        toBeEither(a: unknown, b: unknown): void;
        /**
         *
         * @param {...any} values
         * @example
         */
        toBeAnyOf(...values: unknown[]): void;
    }
}