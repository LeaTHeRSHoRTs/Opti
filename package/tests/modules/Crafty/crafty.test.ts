import "opti";
import "opti/crafty";

describe("opti.crafty", () => {
  it("should be truthy", () => expect(Opti.crafty).toBeTruthy());
});

describe("Crafty", () => {
  describe("craft", () => {
    it("should be able to make a Crafty.Element", () => {
      expect(Crafty.craft("h1") instanceof Crafty.Element).toBe(true);
      expect(Crafty.craft("div") instanceof Crafty.Element).toBe(true);
      expect(Crafty.craft("p") instanceof Crafty.Element).toBe(true);
      expect(Crafty.craft("MyString") instanceof Crafty.Element).toBe(false);
    });

    it("should be able to ", () => {

    });
  });

  describe("from", () => {
    it("should be able to make a Crafty.Unknown", () => {
      expect(Crafty.from(document.createElement("h1")) instanceof Crafty.Unknown).toBe(true);
    });
  });
});