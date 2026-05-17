import "opti";
import "opti/flow";

declare global {
  var FLAG_1: boolean;
  var FLAG_2: boolean | undefined;
  var nonExistentProp: string | undefined;

  interface Document {
    nonWorkingFunction(): void;
  }
}

describe("Opti.flow", () => {
  it("should be true", () => {
    expect(Opti.flow).toBe(true);
  });
});

describe("Flow.flows", () => {
  it("should be able to check if an implementation works", () => {
    expect(Flow.flows(document.createElement)).toBeTruthy();
    expect(Flow.flows(document.nonWorkingFunction)).toBeFalsy();
  });
});

describe("Flow.always", () => {
  it("should be able to check if an implementation works", () => {
    expect(Flow.always(document.createElement, vi.fn())).toContain(false);
    expect(Flow.always(document.nonWorkingFunction, vi.fn())).toContain(true);
  });

  it("should be able to replace with the supplied value if the original value was unusable", () => {
    const mock1 = vi.fn();
    const mock2 = vi.fn();

    const [result1, replaced1] = Flow.always(document.createElement, mock1);
    const [result2, replaced2] = Flow.always(document.nonWorkingFunction, mock2);

    expect(replaced1).toBeFalsy();
    expect(replaced2).toBeTruthy();
    expect(result1).not.toBe(mock1);
    expect(result2).toBe(mock2);
  });
});

describe("Flow.globals", () => {
  describe("flows", () => {
    it("should be able to check if an implementation works", () => {
      expect(Flow.globals.flows('document')).toBeTruthy();
      expect(Flow.globals.flows('nonExistentProp')).toBeFalsy();
    });
  });

  describe("always", () => {
    beforeEach(() => {
      vi.stubGlobal('FLAG_1', true);
      vi.stubGlobal('FLAG_2', undefined);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("should not assign new values to global objects when the value passes the check", () => {
      const res = Flow.globals.always('FLAG_1', false);

      expect(res).toBeFalsy();
      expect(globalThis.FLAG_1).toBeTruthy();
    });

    it("should assign a new value if the original value does not pass the check", () => {
      const res = Flow.globals.always('FLAG_2', true);

      expect(res).toBeTruthy();
      expect(globalThis.FLAG_2).toBeTruthy();
    });
  });
});