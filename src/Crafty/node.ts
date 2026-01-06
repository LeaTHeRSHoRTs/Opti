import { isHTMLTag } from "./helpers";

export default abstract class Internal_Node implements Crafty.Node, Crafty.Parent {
  public abstract readonly kind: Crafty.NodeKind;
  public children: Crafty.Children;

  constructor(...children: Crafty.Children) {
    this.children = children ?? [];
  }
  abstract normalize(onMount: (node: globalThis.Node) => void): globalThis.Node;

  wrap<U extends HTMLTag>(tag: U): Crafty.HTMLElement<U, {}>;
  wrap<N extends Crafty.Namespace, U extends Crafty.TagFromNamespace<N>>(namespace: N, tag: U): Crafty.Element<N, U, {}>;
  wrap(nsOrTag: Crafty.Namespace | HTMLTag, tag?: string): Crafty.Element<Crafty.Namespace, string, {}> {
    if (isHTMLTag(nsOrTag)) {
      return Crafty.craft(nsOrTag, {}, this.children);
    } else if (tag) {
      return Crafty.craft(nsOrTag, tag, {}, this.children);
    } else {
      throw new Crafty.Exception("parameter tag must be provided when wrapping");
    }
  }

  append(child: Crafty.Node): this {
    this.children.push(child);
    return this;
  }
  prepend(child: Crafty.Node): this {
    this.children.unshift(child);
    return this;
  }
  appendTo(node: Crafty.Parent): void {
    node.children.push(this);
  }

  prependTo(node: Crafty.Parent): void {
    node.children.push(this);
  }

  parent(): Crafty.Node | null {
    return this;
  }

  clone(): this {
    return Object.clone(this);
  }
}