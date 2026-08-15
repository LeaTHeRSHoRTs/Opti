import Internal_Node from "./node";
import { isHTMLTag } from "./helpers";

export default class Internal_Fragment extends Internal_Node implements Crafty.Fragment {
  public kind: 'fragment' = "fragment";
  #children: Crafty.Node[] = [];

  constructor(...nodes: Crafty.Node[]) {
    super();
    this.#children = nodes;
  }

  children(): Crafty.Node[] {
    return this.#children;
  }
  append(...child: Crafty.Node[]): void {
    this.#children.push(...child);
  }
  prepend(...child: Crafty.Node[]): void {
    this.#children.unshift(...child);
  }
  isEmpty(): this is Crafty.Fragment & { children: [] } {
    return this.#children.length <= 0;
  }

  override wrap<U extends Exclude<HTMLTag, VoidHTMLTag>>(tag: U): Crafty.HTMLElement<U, {}>;
  override wrap<N extends Crafty.Namespace, U extends Crafty.TagFromNamespace<N>>(namespace: N, tag: U): Crafty.Element<N, U, {}>;
  override wrap(nsOrTag: Crafty.Namespace | Exclude<HTMLTag, VoidHTMLTag>, tag?: string): Crafty.Element<Crafty.Namespace, string, {}> {
    if (isHTMLTag(nsOrTag)) {
      return Crafty.craft(nsOrTag, {}, this.#children);
    } else if (tag) {
      return Crafty.craft(nsOrTag, tag, {}, this.#children);
    } else {
      throw new Crafty.Exception("parameter tag must be provided when wrapping");
    }
  }

  normalize(): DocumentFragment {
    const frag = document.createDocumentFragment();
    const subChildren = this.#children.map(v => v.normalize());

    for (const child of subChildren) {
      frag.append(child);
    };

    return frag;
  }

  html(): string {
    return "";
  }
};