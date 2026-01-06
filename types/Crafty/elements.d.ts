declare namespace Crafty {
  interface Element<
    N extends Namespace = Namespace, 
    T extends TagFromNamespace<N> = TagFromNamespace<N>, 
    P extends Props<T> = Props<T>
  > extends Node, Parent {
    readonly kind: 'element' | HTMLTag;
    classList: P["classes"] | [];
    readonly namespaceURI: N;

    attr<K extends Exclude<keyof P, "css">>(prop: K): P[K];
    attr<K extends Exclude<keyof P, "css">>(prop: K, value: P[K]): void;

    txt(): string;
    txt(text: string): void;
    txt(fn: (origin: string) => string): void;

    normalize(onMount?: (node: globalThis.Element) => void): globalThis.Element;
  }

  interface HTMLElement<T extends HTMLTag = HTMLTag, P extends Props<T> = Props<T>> extends Element<"html", T, P>, Parent {
    kind: T;

    css(): P["css"];
    css<K extends keyof P["css"]>(key: K): P["css"][K];
    css<K extends keyof P["css"], V extends P["css"][K]>(key: K, value: V): void

    normalize(onMount?: (node: HTMLElementOf<T>) => void): HTMLElementOf<T>;
  }

  interface VoidHTMLElement<T extends HTMLTag = HTMLTag, P extends Props<T> = Props<T>> extends HTMLElement<T, P> {
    kind: T;
    append(child: Node): never;
    prepend(child: Node): never;
  }
}