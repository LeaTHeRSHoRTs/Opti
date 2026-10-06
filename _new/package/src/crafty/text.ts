import _InternalHTML from "./html";
import _InternalNode from "./node";

export default class _InternalText extends _InternalHTML implements Crafty.Text {
    public override readonly kind: "text" = "text";
    public get length(): number {
        return this._textContent.length;
    };

    constructor(text: string) {
        super(decodeURIComponent(text));
    }

    html(): string;
    html(text: string): void;
    html(fn: (text: string) => string): void;
    html(textOrFn?: string | ((text: string) => string)): string | void {
        if (!textOrFn) {
            return super.html();
        } else if (typeof textOrFn === "string") {
            this.setContent(textOrFn);
        } else {
            this.setContent(textOrFn(super.html()));
        }
    }

    txt = this.html;

    normalize(): globalThis.Text {
        const node = document.createTextNode(this._textContent);
        return node;
    }
}