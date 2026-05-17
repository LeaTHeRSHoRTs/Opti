import { _InternalChildrenNotAllowedException } from "./exceptions";
import _InternalNode from "./node";
import Internal_Text from "./text";

const NamespaceMap = {
  html: null,
  xml: "http://www.w3.org/XML/1998/namespace",
  svg: "http://www.w3.org/2000/svg",
  mathml: "http://www.w3.org/1998/Math/MathML",
} as const;

export class _InternalElement<
  N extends Crafty.Namespace = Crafty.Namespace,
  T extends Crafty.TagFromNamespace<N> = Crafty.TagFromNamespace<N>,
  P extends Crafty.Props<T> = Crafty.Props<T>,
> extends _InternalNode implements Crafty.Element<N, T, P> {
  public readonly namespaceURI: N;
  public readonly kind: "element" | HTMLTag = "element";
  public readonly tag: T;
  #props: P;
  public id: P["id"] | undefined;
  public classList: P["classes"] | [];
  
  constructor(namespace: N, tag: T, props: P = {} as P, children?: Crafty.Node[]) {
    super(...(children ?? []));
    this.namespaceURI = namespace;
    this.tag = tag;
    this.classList = (props.classes ?? []) as P["classes"] | [];
    this.#props = props;
    if (!this.#props.classes) {
      this.#props.classes = [];
    }
    assert(this.#props.classes !== undefined);
  }

  attr<K extends keyof Omit<P, "css">>(prop: K): P[K] {
    return this.#props[prop];
  }

  txt(): string;
  txt(text: string): void;
  txt(fn: (origin: string) => string): void;
  txt(fnOrText?: ((origin: string) => string) | string): string | void {
    if (!fnOrText) {
      return this.children
        .filter(n => n instanceof Internal_Text)
        .map(n => n.txt())
        .join('');
    }

    const current = this.children
      .filter(n => n instanceof Internal_Text)
      .map(n => n.txt())
      .join('');

    const next =typeof fnOrText === 'function'
      ? fnOrText(current)
      : fnOrText;

    this.children = this.children.filter(n => !(n instanceof Internal_Text));

    this.children.push(new Internal_Text(next));
  }

  normalize(): Crafty.NamespaceElementOf<N> {
    const el = document.createElementNS(NamespaceMap[this.namespaceURI], this.tag);

    Object.entries(this.#props).forEach(([key, value]) => {
      if (typeof key === "string") {
        el.setAttribute(key, Array.isArray(value) ? value.join(" ") : String(value));
      }
    });

    el.append(...(this.children.map(c => c.normalize())));

    return el as Crafty.NamespaceElementOf<N>;
  }

  getClasses(): string[] | undefined {
    return this.#props.classes;
  }

  addClass(cls: string): void {
    if (this.#props.classes) {
      this.#props.classes.push(cls);
    }
  }

  removeClass(cls: string): void {
    if (this.#props.classes) {
      const index = this.#props.classes.indexOf(cls);
      delete this.#props.classes[index];
    }
  }

  toggleClass(cls: string): void {
    if (this.#props.classes) {
      const index = this.#props.classes.indexOf(cls);
      if (index !== -1) {
        delete this.#props.classes[index];
      } else {
        this.#props.classes.push(cls);
      }
    }
  }

  static [Symbol.hasInstance](inst: unknown): inst is _InternalElement {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
};

export class _InternalHTMLElement<
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

export class _InternalVoidHTMLElement<T extends HTMLTag, P extends Crafty.Props<T> = Crafty.Props<T>> extends _InternalHTMLElement<T, P> implements Crafty.VoidHTMLElement<T, P> {

  constructor(tag: T, props?: P) {
    super(tag, props, []);
  }

  append(_: Crafty.Node): never {
    throw new _InternalChildrenNotAllowedException("VoidHTMLElements are auto closing elements and therefore cannot have children");
  }
  prepend(_: Crafty.Node): never {
    throw new _InternalChildrenNotAllowedException("VoidHTMLElements are auto closing elements and therefore cannot have children");
  }

  static [Symbol.hasInstance](inst: unknown): inst is _InternalVoidHTMLElement<HTMLTag> {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
}