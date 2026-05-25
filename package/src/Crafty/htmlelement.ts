import _InternalElement from "./element";

export default class _InternalHTMLElement<
  T extends HTMLTag,
  P extends Crafty.Props<T> = Crafty.Props<T>,
> extends _InternalElement<"html", T, P> implements Crafty.HTMLElement<T, P> {

  constructor(tag: T, props?: P, children?: Crafty.Node[]) {
    super("html", tag, props, children);
  }
  public kind: T = this.tag;

  css(): P["css"];
  css<K extends keyof P["css"]>(key: K): P["css"][K];
  css<K extends keyof P["css"], V extends P["css"][K]>(key: K, value: V): void;
  css<K extends keyof P["css"], V extends P["css"][K]>(key?: K, value?: V): void | P["css"] | P["css"][K] {
    throw new NotImplementedException("Method not implemented.");
  }

  normalize(): HTMLElementOf<T> {
    return super.normalize() as HTMLElementOf<T>;
  }

  static [Symbol.hasInstance](inst: unknown): inst is _InternalHTMLElement<HTMLTag> {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
};
