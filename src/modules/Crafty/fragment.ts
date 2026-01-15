import Internal_Node from "./node";
import { isHTMLTag } from "./helpers";

export default class Internal_Fragment extends Internal_Node implements Crafty.Fragment {
  public kind: 'fragment' = "fragment";

  isEmpty(): this is Crafty.Fragment & { children: [] } {
    return this.children.length <= 0;
  }

  override wrap<U extends HTMLTag>(tag: U): Crafty.HTMLElement<U, {}>;
  override wrap<N extends Crafty.Namespace, U extends Crafty.TagFromNamespace<N>>(namespace: N, tag: U): Crafty.Element<N, U, {}>;
  override wrap(nsOrTag: Crafty.Namespace | HTMLTag, tag?: string): Crafty.Element<Crafty.Namespace, string, {}> {
    if (isHTMLTag(nsOrTag)) {
      return Crafty.craft(nsOrTag, {}, this.children);
    } else if (tag) {
      return Crafty.craft(nsOrTag, tag, {}, this.children);
    } else {
      throw new Crafty.Exception("parameter tag must be provided when wrapping");
    }
  }

  normalize(): DocumentFragment {
    const frag = document.createDocumentFragment();
    const subchildren = this.children.map(v => v.normalize());

    for (const child of subchildren) {
      frag.append(child);
    };

    return frag;
  }

  static [Symbol.hasInstance](inst: unknown): inst is Internal_Fragment {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
};