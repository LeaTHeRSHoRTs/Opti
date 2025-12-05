import "../../dist/opti";
import "../../dist/crafty";

describe("Crafty", () => {
  describe("opti.crafty", () => {
    it("should be truthy", () => expect(opti.crafty).toBeTruthy());
  });

  describe("craft", () => {
    it("should be able to make a Crafty.Element", () => {
      expect(Crafty.craft("h1")).toBeInstanceOf(Crafty.Element);
      expect(Crafty.craft("div")).toBeInstanceOf(Crafty.Element);
      expect(Crafty.craft("p")).toBeInstanceOf(Crafty.Element);
      expect(Crafty.craft("h1")).toBeInstanceOf(Crafty.Element);
    }); 
  });

  describe("from", () => {
    it("should be able to make a Crafty.Unknown", () => {
      expect(Crafty.from(document.createElement("h1"))).toBeInstanceOf(Crafty.Unknown);
    });
  });
});