declare namespace Crafty {
  // Statics
  interface NodeStatic {
    [Symbol.hasInstance](inst: unknown): inst is Crafty.Node;
  }

  interface FragmentStatic {
    [Symbol.hasInstance](inst: unknown): inst is Crafty.Fragment;
  }

  interface TextStatic {
    [Symbol.hasInstance](inst: unknown): inst is Crafty.Text;
  }

  interface UnknownStatic {
    [Symbol.hasInstance](inst: unknown): inst is Crafty.Unknown;
  }

  interface CommentStatic {
    [Symbol.hasInstance](inst: unknown): inst is Crafty.Comment;
  }

  // Instance types
  interface Node {
    readonly kind: Crafty.NodeKind;
    parent(): Node | null;
    normalize(onMount?: (node: globalThis.Node) => void): globalThis.Node;
    wrap<U extends HTMLTag>(tag: U): HTMLElement<U, {}>;
    wrap<N extends Namespace, U extends TagFromNamespace<N>>(namespace: N, tag: U): Element<N, U, {}>;
    clone(): this;

    html(): string;
    txt(): string;
    txt(text: string): void;
    txt(fn: (original: string) => string): void;
  }

  interface Parent<T extends Node = Node> {
    children: T[];
    append(child: T): void;
    prepend(child: T): void;
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

  interface Comment extends Node, Parent<Text> {
    readonly kind: 'comment';
    normalize(onMount?: (node: globalThis.Comment) => void): globalThis.Comment;
  }
}