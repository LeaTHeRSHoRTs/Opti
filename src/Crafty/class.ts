import * as Nodes from "./nodes";
export class Crafty {
  private constructor() { }
  static Node = Nodes.Node;
  static Element = Nodes.Element;
  static Fragment = Nodes.Fragment;

  static Unknown = class Unknown<T extends unknown[]> {
    private data: T;
    constructor(...data: T) {
      this.data = data;
    }
  };
  static craft<C extends Crafty.Child[]>(children: C): Crafty.Fragment<C>;
  static craft<T extends HTMLTag, U extends Crafty.Props<T>, V extends Crafty.Child[]>(
    tag: T,
    props?: U,
    children?: V
  ): Crafty.Element<T, U, V>;
  static craft<T extends HTMLTag, U extends Crafty.Props<T>, V extends Crafty.Child[]>(
    tagOrChildList: T | V,
    propsOrChild?: U,
    children?: V
  ): Crafty.Element<T, U, V> | Crafty.Fragment<V> {
    if (typeof tagOrChildList === "string") {
      return new Crafty.Element((tagOrChildList as T), propsOrChild as U, children);
    } else {
      return new Crafty.Fragment(tagOrChildList);
    }
  }

  static from(element: string): Crafty.Unknown;
  static from(html: HTMLElement): Crafty.Unknown;
  static from(frag: DocumentFragment): Crafty.Unknown;
  static from(element: HTMLElement | string | DocumentFragment): Crafty.Unknown {
    if (typeof element === "string") {
      return new Crafty.Unknown(element);
    } else if (element instanceof DocumentFragment) {
      return new Crafty.Unknown(element.children);
    }
    return new Crafty.Unknown(element.tagName, {}, element.children);
  }
}