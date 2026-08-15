import "opti";
import "opti/crafty";
import _InternalElement from "../../src/Crafty/element";
import _InternalHTMLElement from "../../src/Crafty/htmlelement";
import _InternalText from "../../src/Crafty/text";
import _InternalFragment from "../../src/Crafty/fragment";
import _InternalNode from "../../src/Crafty/node";
import { _InternalCrafty } from "../../src/Crafty/class";

describe("opti.crafty", () => {
  it("should be truthy", () => expect(Opti.crafty).toBeTruthy());
});

describe("Crafty", () => {
  describe("Crafty.craft", () => {
    it("should be able to make a Element", () => {
      expect(Crafty.craft("h1")).toBeInstanceOf(_InternalElement);
      expect(Crafty.craft("div")).toBeInstanceOf(_InternalElement);
      expect(Crafty.craft("p")).toBeInstanceOf(_InternalElement);
      expect(Crafty.craft('xml', "MyString")).toBeInstanceOf(_InternalElement);
    });

    it("should be able to make a HTMLElement", () => {
      expect(Crafty.craft('div')).toBeInstanceOf(_InternalHTMLElement);
      expect(Crafty.craft('div', { id: "div1" })).toBeInstanceOf(_InternalHTMLElement);
      expect(Crafty.craft('div', { classes: ["divs"] })).toBeInstanceOf(_InternalHTMLElement);
      expect(Crafty.craft('div', { classes: ["divs"], id: "div3" }, [Crafty.craft(Crafty.TEXT, "Text node")])).toBeInstanceOf(_InternalHTMLElement);
    });

    it("should be able to make a Text", () => {
      expect(Crafty.craft(Crafty.TEXT, "text")).toBeInstanceOf(_InternalText);
    });

    it("should be able to make a Comment", () => {
      expect(Crafty.craft(Crafty.COMMENT, "text")).toBeInstanceOf(_InternalText);
    });

    it("should be able to make a Fragment", () => {
      expect(Crafty.craft(Crafty.craft(Crafty.TEXT, "text node 1"), Crafty.craft(Crafty.TEXT, "Text node 2"), Crafty.craft(Crafty.TEXT, "Text node 3"))).toBeInstanceOf(_InternalFragment);
      expect(Crafty.craft(Crafty.craft(Crafty.craft('h1'), Crafty.craft('h2'), Crafty.craft(Crafty.TEXT, "Text node 3")))).toBeInstanceOf(_InternalFragment);
      expect(Crafty.craft(Crafty.craft(Crafty.craft('xml', 'MyElement')))).toBeInstanceOf(_InternalFragment);
    });
  });

  describe("Crafty.from", () => {
    it("should be able to make a Node", () => {
      expect(Crafty.from(document.createElement("h1"))).toBeInstanceOf(_InternalNode);
    });

    it("should be able to make a Element", () => {
      expect(Crafty.from(document.createElementNS('http://www.w3.org/2000/svg', 'a'))).toBeInstanceOf(_InternalElement);
      expect(Crafty.from(document.createElementNS('http://www.w3.org/1999/xhtml', 'circle'))).toBeInstanceOf(_InternalElement);
      expect(Crafty.from(document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mn'))).toBeInstanceOf(_InternalElement);
    });

    it("should be able to make a HTMLElement", () => {
      const aElement = Crafty.from(document.createElement('a'));
      const divElement = Crafty.from(document.createElement('div'));
      const pElement = Crafty.from(document.createElement('p'));

      expect(aElement).toBeInstanceOf(_InternalHTMLElement);
      expect(divElement).toBeInstanceOf(_InternalHTMLElement);
      expect(pElement).toBeInstanceOf(_InternalHTMLElement);
      
      expect(aElement.kind).toBe('a');
      expect(divElement.kind).toBe('div');
      expect(pElement.kind).toBe('p');
    });
  });
});