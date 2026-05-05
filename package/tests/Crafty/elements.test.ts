import "opti";
import "opti/crafty";

describe("Element", () => {
  it("should be assignable to a variable", () => {
    const el = Crafty.craft("b", {}, [Crafty.craft("Hello world!")]);
    el.append(Crafty.craft("MORE!"));
  });
});