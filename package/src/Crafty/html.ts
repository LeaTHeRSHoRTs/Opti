import _InternalException from "./exceptions";
import _InternalNode from "./node";

export default class _InternalHTML extends _InternalNode implements Crafty.Html {
  override kind: 'html' = 'html';
  override readonly _children: [] = [];
  #content: string;

  constructor(content: string) {
    super(); 
    this.#content = content;
  }

  html(): string {
    return this.#content;
  }

  protected setContent(contents: string): void {
    this.#content = contents;
  }

  normalize(): Dom.DocumentFragment {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.#content, "text/html");
    const frag = document.createDocumentFragment();
    Array.from(doc.body.childNodes).forEach(n => frag.appendChild(n));
    return frag;
  }
}