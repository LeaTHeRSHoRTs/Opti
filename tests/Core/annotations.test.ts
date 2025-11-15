describe("Abstract", () => {
  it("Should be able to be applied", () => {
    expect(() => {
      @Abstract class Example {
        @Abstract getValue() {}
      }
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