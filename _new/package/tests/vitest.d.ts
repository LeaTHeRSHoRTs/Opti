import 'vitest';

declare module 'vitest' {
  interface Assertion {
    toBeEither(a: unknown, b: unknown): void;
    toBeAnyOf(...values: unknown[]): void;
  }
}