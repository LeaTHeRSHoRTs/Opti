import "opti";
import "opti/crafty";

describe("Element.txt", () => {
  it("should be retrievable", () => {
    const el = Crafty.craft("b", {}, [Crafty.craft(Crafty.TEXT, "Hello world!")]);
    el.append(Crafty.craft(Crafty.TEXT, "MORE!"));

    expect(el.txt()).toContain('MORE!');
    expect(el.txt()).toContain('Hello world!');
  });

  it("should work with assigning", () => {
    const el = Crafty.craft("b");
    el.txt("New Text");

    expect(el.txt()).toContain('New Text');
  });

  it("should work with the function", () => {
    const el = Crafty.craft("b");
    el.txt("New Text");
    el.txt(origin => origin.replace("Text", "World"));

    expect(el.txt()).toContain('New World');
  });
});

describe("Element.getClasses");
describe("Element.attr");
describe("Element.props");
describe("Element.namespace");
describe("Element.tag");
describe("Element.addEventListener");
describe("Element.removeEventListener");
describe("Element.$");
describe("Element.normalize");