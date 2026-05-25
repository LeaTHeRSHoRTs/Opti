import { _InternalChildrenNotAllowedException } from "./exceptions";
import { isHTMLTag, isVoidHTMLTag } from "./helpers";
import _InternalText from "./text";

export default abstract class _InternalNode implements Crafty.Node {
  public abstract readonly kind: Crafty.NodeKind;
  protected _textContent: string = "";
  public _parent: Crafty.Node | null = null;

  abstract normalize(onMount: (node: globalThis.Node) => void): globalThis.Node;

  wrap<U extends HTMLTag>(tag: U): Crafty.HTMLElement<U, {}>;
  wrap<N extends Crafty.Namespace, U extends Crafty.TagFromNamespace<N>>(namespace: N, tag: U): Crafty.Element<N, U, {}>;
  wrap(nsOrTag: Crafty.Namespace | HTMLTag, tag?: string): Crafty.Element<Crafty.Namespace, string, {}> {
    if (!isVoidHTMLTag(nsOrTag)) {
      if (isHTMLTag(nsOrTag)) {
        return Crafty.craft(nsOrTag, {});
      } else {
        return Crafty.craft(nsOrTag, tag as string, {});
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
      this._textContent = fnOrText;
    } else if (fnOrText) {
      this._textContent = fnOrText(this._textContent);
    }
  }

  parent(): Crafty.Node | null { return this._parent; }

  clone(): this { return Object.clone(this); }
}