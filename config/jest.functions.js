/* eslint-disable no-undef */

const customMatchers = {
  toThrowException(
    received,
    expectedException,
    expectedMessage,
    expectedCause
  ) {
    let pass = false;
    let actual;

    try {
      received(); // call the function
    } catch (err) {
      err;
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
};

// Add the matcher globally
expect.extend(customMatchers);