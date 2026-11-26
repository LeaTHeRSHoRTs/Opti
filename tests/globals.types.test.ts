describe("_", () => {
    it("should be equivalent to unknown", () => {
        expectTypeOf<_>().toBeUnknown();
    });
});

describe()