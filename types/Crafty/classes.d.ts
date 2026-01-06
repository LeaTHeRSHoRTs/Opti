declare namespace Crafty {
  interface Node {
    readonly kind: Crafty.NodeKind;
    parent(): Node | null;
    normalize(onMount?: (node: globalThis.Node) => void): globalThis.Node;
    wrap<U extends HTMLTag>(tag: U): HTMLElement<U, {}>;
    wrap<N extends Namespace, U extends TagFromNamespace<N>>(namespace: N, tag: U): Element<N, U, {}>;
    clone(): this
  }

  interface Parent<T extends Node = Node> {
    children: T[];
    append(child: T): this;
    prepend(child: T): this;
  }

  interface Fragment extends Node, Parent {
    readonly kind: 'fragment';
    normalize(onMount?: (node: globalThis.DocumentFragment) => void): globalThis.DocumentFragment;
    isEmpty(): this is Fragment & { children: [] };
  }

  interface Text extends Node {
    readonly kind: 'text';
    readonly length: number;
    txt(): string;
    txt(text: string): void;
    txt(fn: (origin: string) => string): void;

    normalize(onMount?: (node: globalThis.Text) => void): globalThis.Text;
  }

  interface Unknown extends Node {
    kind: 'unknown'
    readonly contents: string | globalThis.Element | undefined;
    normalize(onMount?: (node: globalThis.Node) => void): never;
  }

  interface Comment extends Node, Parent<Text> {
    readonly kind: 'comment'
    normalize(onMount?: (node: globalThis.Comment) => void): globalThis.Comment;
  }
}