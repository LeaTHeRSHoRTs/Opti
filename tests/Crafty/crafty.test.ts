import "opti";
import "opti/crafty";

describe("opti.crafty", () => {
  it("should be truthy", () => expect(opti.crafty).toBeTruthy());
});

describe("Crafty", () => {
  describe("craft", () => {
    it("should be able to make a Crafty.Element", () => {
      expect(Crafty.isElement(Crafty.craft("h1"))).toBe(true);
      expect(Crafty.isElement(Crafty.craft("div"))).toBe(true);
      expect(Crafty.isElement(Crafty.craft("p"))).toBe(true);
      expect(Crafty.isElement(Crafty.craft("h1"))).toBe(true);
    });

    it("should be able to ", () => {

    });
  });

  describe("from", () => {
    it("should be able to make a Crafty.Unknown", () => {
      expect(Crafty.isUnknown(Crafty.from(document.createElement("h1")))).toBe(true);
    });
  });
});