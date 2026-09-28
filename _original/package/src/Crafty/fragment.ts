import _InternalNode from "./node";
import { isHTMLTag } from "./helpers";

export default class Internal_Fragment extends _InternalNode implements Crafty.Fragment {
  public kind: 'fragment' = "fragment";

  isEmpty(): this is Crafty.Fragment & { children: [] } {
    return this._children.length <= 0;
  }

  override wrap<U extends Exclude<HTMLTag, VoidHTMLTag>>(tag: U): Crafty.HTMLElement<U, {}>;
  override wrap<N extends Crafty.Namespace, U extends Crafty.TagFromNamespace<N>>(namespace: N, tag: U): Crafty.Element<N, U, {}>;
  override wrap(nsOrTag: Crafty.Namespace | Exclude<HTMLTag, VoidHTMLTag>, tag?: string): Crafty.Element<Crafty.Namespace, string, {}> {
    if (isHTMLTag(nsOrTag)) {
      return Crafty.craft(nsOrTag, {}, this._children);
    } else if (tag) {
      return Crafty.craft(nsOrTag, tag, {}, this._children);
    } else {
      throw new Crafty.Exception("parameter tag must be provided when wrapping");
    }
  }

  normalize(): DocumentFragment {
    const frag = document.createDocumentFragment();
    const subchildren = this._children.map(v => v.normalize());

    for (const child of subchildren) {
      frag.append(child);
    };

    return frag;
  }

  static [Symbol.hasInstance](inst: unknown): inst is Internal_Fragment {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
};