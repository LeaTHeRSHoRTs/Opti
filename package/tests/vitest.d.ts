import 'vitest';

declare module 'vitest' {
  interface Assertion {
    toThrowException(
      exception: ExceptionConstructor, 
      message?: string, 
      stack?: string
    ): void;

    toBeEither(a: unknown, b: unknown): void;
    toBeAnyOf(...values: unknown[]): void;
  }
}