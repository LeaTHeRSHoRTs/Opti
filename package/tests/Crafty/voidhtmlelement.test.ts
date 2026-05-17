import 'opti';
import 'opti/crafty';

describe("VoidHTMLElement.prepend, VoidHTMLElement.append", () => {
  let el: Crafty.VoidHTMLElement;
  let parent: Crafty.HTMLElement;

  beforeAll(() => {
    el = Crafty.craft('br');
    parent = Crafty.craft('div');
  });

  it("should not work", () => {
    expect(() => {
      el.append(parent);
    }).toThrowException(Crafty.ChildrenNotAllowedException);

    expect(() => {
      el.prepend(parent);
    }).toThrowException(Crafty.ChildrenNotAllowedException);
  });
});