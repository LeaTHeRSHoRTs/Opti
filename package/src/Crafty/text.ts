import Internal_Node from "./node";

export default class Internal_Text extends Internal_Node implements Crafty.Text {
  public kind: "text" = "text";
  #text: string;
  public get length(): number {
    return this.#text.length;
  };
  constructor(text: string) {
    super();
    this.#text = text;
  }

  txt(): string;
  txt(text: string): void;
  txt(fn: (text: string) => string): void;
  txt(textOrFn?: string | ((text: string) => string)): string | void {
    if (!textOrFn) {
      return this.#text;
    } else if (typeof textOrFn === "string") {
      this.#text = textOrFn;
    } else {
      this.#text = textOrFn(this.#text);
    }
  }

  normalize(onMount?: (node: globalThis.Text) => void): globalThis.Text {
    const node = document.createTextNode(this.#text);
    onMount?.(node);
    return node;
  }

  static [Symbol.hasInstance](inst: unknown): inst is Internal_Text {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
}