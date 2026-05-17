import { _InternalChildrenNotAllowedException } from "./exceptions";
import { isHTMLTag, isVoidHTMLTag } from "./helpers";
import _InternalText from "./text";

export default abstract class _InternalNode implements Crafty.Node, Crafty.Parent {
  public abstract readonly kind: Crafty.NodeKind;
  public children: Crafty.Node[];

  constructor(...children: Crafty.Node[]) {
    this.children = children ?? [];
  }
  abstract normalize(onMount: (node: globalThis.Node) => void): globalThis.Node;

  wrap<U extends HTMLTag>(tag: U): Crafty.HTMLElement<U, {}>;
  wrap<N extends Crafty.Namespace, U extends Crafty.TagFromNamespace<N>>(namespace: N, tag: U): Crafty.Element<N, U, {}>;
  wrap(nsOrTag: Crafty.Namespace | HTMLTag, tag?: string): Crafty.Element<Crafty.Namespace, string, {}> {
    if (!isVoidHTMLTag(nsOrTag)) {
      if (isHTMLTag(nsOrTag)) {
        return Crafty.craft(nsOrTag, {}, this.children);
      } else {
        return Crafty.craft(nsOrTag, tag as string, {}, this.children);
      }
    } else {
      throw new Crafty.Exception("Parameter tag must not be a void HTML tag");
    }
  }

  txt(): string;
  txt(text: string): void;
  txt(fn: (original: string) => string): void;
  txt(fnOrText?: string | ((original: string) => string)): string | void {
    if (typeof fnOrText === 'string') {
      this.children.push(new _InternalText(fnOrText));
    } else if (fnOrText) {
      const text = this.children
        .filter(node => node instanceof _InternalText)
        .map(node => node.txt())
        .join();

      this.children.push(new _InternalText(text));
    }
  }

  html(): string {
    return this.children.map(node => node.html()).join();
  }

  append(child: Crafty.Node): void { this.children.push(child); }
  prepend(child: Crafty.Node): void { this.children.unshift(child); }
  appendTo(node: Crafty.Parent): void { node.children.push(this); }
  prependTo(node: Crafty.Parent): void { node.children.unshift(this); }

  parent(): Crafty.Node | null {
    throw new NotImplementedException();
  }

  clone(): this {
    return Object.clone(this);
  }

  static [Symbol.hasInstance](inst: unknown): inst is _InternalNode {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
}