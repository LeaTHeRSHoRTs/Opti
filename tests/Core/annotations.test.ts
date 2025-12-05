import "../../dist/opti";

describe("Abstract", () => {
  it("Should be able to be applied", () => {
    expect(() => {
      @Abstract class Example {
        @Abstract getValue() {}
      }
    }).not.toThrow();
  });

  it("should not be instantizable", () => {
    expect(() => {
      @Abstract class Example {
        @Abstract getValue() {}
      }

      new Example();
    }).toThrow(AbstractInitializationException);
  });

  it("should be able to produce instantizable subclasses", () => {
    expect(() => {
      @Abstract class Example {
        @Abstract getValue(): boolean { return false; }
      }

      class NotAbstract extends Example {
        override getValue(): boolean {
          return true;
        }
      }

      const cls = new NotAbstract();
      expect(cls.getValue()).toBe(true);
    }).not.toThrow();
  });
});

describe("Final", () => {
  it("Should be able to be applied", () => {
    expect(() => {
      @Final class Example {
        @Final getValue() {}
      }
    }).not.toThrow();
  });
});