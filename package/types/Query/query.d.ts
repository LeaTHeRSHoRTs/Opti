declare namespace Query {
  interface $ {
    <T extends HTMLTag>(selector: T): HTMLElementOf<T> | null;
    (selector: string): HTMLElement | null;

    all(selector: string): [HTMLElement, ...HTMLElement[]] | null;

    assert<T extends HTMLTag>(selector: string, tag: T): HTMLElementOf<T> | null;

    query(): Query.Builder;

    tear<T extends HTMLTag>(selector: T): HTMLElementOf<T> | null;
    tear(selector: string): HTMLElement;

    explicit<T extends HTMLTag>(selector: string, tag: T): HTMLElementOf<T> | null;

    with<T extends HTMLTag>(selector: `${T}${string}`): HTMLElementOf<T> | null;
    with(selector: string): HTMLElement | null;
  }

  interface $$ {
    <T extends HTMLTag>(selector: T): HTMLElementOf<T>[];
    (selector: string): HTMLElement[];

    all(selector: string): HTMLElement[][];

    assert(selector: string): <T extends HTMLTag>(tag: T) => HTMLElementOf<T>[];

    query(): Query.Builder;

    tear<T extends HTMLTag>(selector: T): HTMLElementOf<T>[];
    tear(selector: string): HTMLElement[];

    explicit<T extends HTMLTag>(selector: string, tag: T): HTMLElementOf<T>[];

    with<T extends HTMLTag>(selector: `${T}${string}`): HTMLElementOf<T>[];
    with(selector: string): HTMLElement[];
  }

  interface Builder {
    is(selector: string): this;
    isnt(selector: string): this;
  }
}