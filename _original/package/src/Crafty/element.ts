import { _InternalChildrenNotAllowedException } from "./exceptions";
import _InternalNode from "./node";
import _InternalText from "./text";

const NamespaceMap = {
  html: null,
  xml: "http://www.w3.org/XML/1998/namespace",
  svg: "http://www.w3.org/2000/svg",
  mathml: "http://www.w3.org/1998/Math/MathML",
} as const;

export default class _InternalElement<
  N extends Crafty.Namespace = Crafty.Namespace,
  T extends Crafty.TagFromNamespace<N> = Crafty.TagFromNamespace<N>,
  P extends Crafty.Props<T> = Crafty.Props<T>,
> extends _InternalNode implements Crafty.Element<N, T, P> {
  public readonly namespaceURI: N;
  public readonly kind: "element" | HTMLTag = "element";
  public readonly tag: T;
  public id: P["id"] | undefined;
  public classList: P["classes"] | [];

  #props: P;
  #children: Crafty.Node[];
  
  constructor(namespace: N, tag: T, props: P = {} as P, children?: Crafty.Node[]) {
    super();
    this.namespaceURI = namespace;
    this.tag = tag;
    this.classList = (props.classes ?? []) as P["classes"] | [];
    this.#children = children ?? [];
    this.#props = props;
    if (!this.#props.classes) {
      this.#props.classes = [];
    }
  }

  attr<K extends keyof Omit<P, "css">>(prop: K): P[K];
  attr<K extends keyof Omit<P, "css">>(prop: K, value: P[K] | null): void;
  attr<K extends keyof Omit<P, "css">>(prop: K, value?: P[K] | null): P[K] | void {
    if (value) {
      this.#props[prop] = value;
      return;
    }

    return this.#props[prop];
  }

  txt(): string;
  txt(text: string): void;
  txt(fn: (origin: string) => string): void;
  txt(fnOrText?: ((origin: string) => string) | string): string | void {
    if (!fnOrText) {
      return this.#children
        .filter(n => n instanceof _InternalText)
        .map(n => n.txt())
        .join('');
    }

    const current = this.#children
      .filter(n => n instanceof _InternalText)
      .map(n => n.txt())
      .join('');

    const next = typeof fnOrText === 'function'
      ? fnOrText(current)
      : fnOrText;

    this.#children = this.#children.filter(n => !(n instanceof _InternalText));

    this.#children.push(new _InternalText(next));
  }

  normalize(): Crafty.NamespaceElementOf<N> {
    const el = document.createElementNS(NamespaceMap[this.namespaceURI], this.tag);

    Object.entries(this.#props).forEach(([key, value]) => {
      if (typeof key === "string") {
        el.setAttribute(key, Array.isArray(value) ? value.join(" ") : String(value));
      }
    });

    el.append(...(this.#children.map(c => c.normalize())));

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

  append(...nodes: Arr.Present<_InternalNode>): void {
    nodes.forEach(n => n._parent = this);
    this.#children.push(...nodes);
  }

  prepend(...nodes: Arr.Present<_InternalNode>): void {
    nodes.forEach(n => n._parent = this);
    this.#children.unshift(...nodes);
  }

  children(): Crafty.Node[] {
    return this.#children;
  }

  hasClass(cls: string): boolean {
    return this.#props.classes?.includes(cls) ?? false;
  }
};