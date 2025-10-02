describe("Crafty", () => {
  describe("craft", () => {
    it("should be able to make a Crafty.Element", () => {
      expect(Crafty.craft("h1")).toBeInstanceOf(Crafty.Element);
    }); 
  });
});