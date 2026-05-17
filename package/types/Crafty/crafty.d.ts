declare namespace Crafty {
  type NodeKind = 'element' | HTMLTag | 'text' | 'fragment' | 'comment' | 'unknown';

  type Namespace = "html" | "svg" | "mathml" | "xml";

  type TagFromNamespace<N extends Namespace> = N extends "html" ? HTMLTag : N extends "svg" ? SVGTag : N extends "mathml" ? MathMLTag : string;

  type NamespaceURL<N extends Namespace> = N extends "html" ? null : N extends "xml" ? "http://www.w3.org/XML/1998/namespace" : N extends "svg" ? "http://www.w3.org/2000/svg" : N extends "mathml" ? "http://www.w3.org/1998/Math/MathML" : null;

  type NamespaceElementOf<N extends Namespace> = N extends "html" ? globalThis.HTMLElement : N extends "xml" ? globalThis.Element : N extends "svg" ? globalThis.SVGElement : N extends "mathml" ? globalThis.MathMLElement : globalThis.Element;

  type Props<T extends string> = {
    classes?: string[],
    text?: string,
    id?: string,
    name?: string,
    css?: Partial<WritableOnly<Only<CSSStyleDeclaration, string | number>>>
  } & Partial<Pick<HTMLElementOf<T>, AccessorKeys<HTMLElementOf<T>>>>;
}