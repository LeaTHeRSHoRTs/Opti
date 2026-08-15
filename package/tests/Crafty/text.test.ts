import 'opti';
import 'opti/crafty';

describe("Text.length", () => {
  let textNode: Crafty.Text;
  let originText: string;

  beforeAll(() => {
    originText = "Text Node";
    textNode = Crafty.craft(Crafty.TEXT, originText);
  });

  it("should return the correct length of the text inside the object", () => {
    expect(textNode.length).toBe(originText.length);
  });
});

describe("Text.txt", () => {
  let textNode: Crafty.Text;
  let originText: string;

  beforeAll(() => {
    originText = "Text Node";
    textNode = Crafty.craft(Crafty.TEXT, originText);
  });

  it("should return the correct text", () => {
    expect(textNode.txt()).toBe(originText);
  });

  it("should be able to set the text using a string", () => {
    const newText = "New text";

    textNode.txt(newText);

    expect(textNode.txt()).toBe(newText);
  });

  it("should be able to set the text using a function", () => {
    const newText = "New text";

    textNode.txt((original) => original + " " + newText);

    expect(textNode.txt()).toBe(originText + " " + newText);
  });
});

describe("Text.normalize", () => {
  let textNode: Crafty.Text;
  let originText: string;

  beforeAll(() => {
    originText = "Text Node";
    textNode = Crafty.craft(Crafty.TEXT, originText);
  });

  it("should be able to return a normal text node from itself", () => {
    const normalized = textNode.normalize();

    expect(normalized).toBeInstanceOf(window.Text);
    expect(normalized.textContent).toBe(textNode.txt());
  });
});