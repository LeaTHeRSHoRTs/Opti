/// <reference types="./node_modules/@types/node">
/// <reference types="./package/types/Core/classes.d.ts">
import { expect, type MatcherState } from 'vitest';
import { execSync } from 'child_process';

execSync("tsc --noEmit", { stdio: 'inherit' });

expect.extend({
  toThrowException(
    this: MatcherState,
    received: (...args: any[]) => any,
    expectedException: new (...args: any[]) => any,
    expectedMessage: unknown,
    expectedCause: unknown
  ) {
    let pass = false;
    let actual: unknown;

    try {
      received();
    } catch (e) {
      const err = e as Exception;
      actual = err;
      pass = err instanceof expectedException;

      if (pass && expectedMessage !== undefined) {
        pass = pass && err.getMessage && err.getMessage() === expectedMessage;
      }

      if (pass && expectedCause !== undefined) {
        pass = pass && err.getCause && err.getCause() === expectedCause;
      }
    }

    return {
      pass,
      message: () =>
        pass
          ? `expected function not to throw ${expectedException.name} with message "${expectedMessage}" and cause "${expectedCause}"`
          : `expected function to throw ${expectedException.name}` +
            (expectedMessage ? ` with message "${expectedMessage}"` : "") +
            (expectedCause ? ` and cause "${expectedCause}"` : "") +
            `, but got ${actual}`,
    };
  },
  toBeEither(this: MatcherState, received: unknown, actual1: unknown, actual2: unknown) {
    const pass1 = this.equals(received, actual1);
    const pass2 = this.equals(received, actual2);
    const pass = pass1 || pass2;

    return {
      pass,
      message: () => {
        const hint = this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeEither`,
          "received",
          "expected1, expected2"
        );

        const expected1 = this.utils.printExpected(actual1);
        const expected2 = this.utils.printExpected(actual2);
        const receivedStr = this.utils.printReceived(received);

        return (
          hint +
          "\n\n" +
          `Expected value to ${this.isNot ? "NOT " : ""}be either:\n` +
          `  ${expected1} or ${expected2}\n` +
          `Received:\n` +
          `  ${receivedStr}`
        );
      }
    };
  },
  toBeAnyOf(this: MatcherState, received: unknown, ...actuals: unknown[]) {
    const pass = actuals.some(v => this.equals(received, v));

    return {
      pass,
      message: () => {
        const hint = this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeAnyOf`,
          "received",
          "expected"
        );

        const expectedList = actuals.map(v => this.utils.printExpected(v)).join(", ");
        const receivedStr = this.utils.printReceived(received);

        return (
          hint +
          "\n\n" +
          `Expected value to ${this.isNot ? "NOT " : ""}be any of the following:\n` +
          `  ${expectedList}\n` +
          `Received:\n` +
          `  ${receivedStr}`
        );
      }
    };
  }
});