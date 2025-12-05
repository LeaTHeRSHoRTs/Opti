(() => {
  const { expect } = require('@jest/globals');

  expect.extend({
    /** @param {"undefined" | "object" | "boolean" | "number" | "string" | "function" | "symbol" | "bigint"} type */
    toBeType(received, type) {
      const pass = typeof received === type;
      return { pass, message: () => `expected ${received}${pass ? "" : " not"} to be instance or primitive of ${type}` };
    }
  });
})();