declare interface ParentNode extends Node {
    /**
   * Returns the parent element.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/parentElement)
   * 
   * @deprecated
   * @migrate {@link Node.parent}
   */
    readonly parentElement: HTMLElement | null;

    /**
   * Returns the parent element.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/parentElement)
   * @deprecated
   * @migrate {@link Node.parent}
   */
    readonly parentNode: ParentNode | null;

    /**
   * Returns the first element that is a descendant of node that matches selectors.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/querySelector)
   * @deprecated
   * @migrate {@link Node.$}
   */
    querySelector: ParentNode["querySelector"];

    /**
   * Returns all element descendants of node that match selectors.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/querySelectorAll)
   * @deprecated
   * @migrate {@link Node.$$}
   */
    querySelectorAll: ParentNode["querySelectorAll"];

    /** 
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/textContent) 
   * @deprecated
   * @migrate {@link Element.txt}
   */
    textContent: string | null;
}

interface Document {
    /**
   * @deprecated
   * @migrate {@link document.ready}
   */
    addEventListener(type: "DOMContentLoaded", listener: (this: Document, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void;

    /**
   * @deprecated
   * @migrate {@link document.ready}
   */
    addEventListener(type: "load", listener: (this: Document, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void;

    /**
   * @deprecated
   * @migrate {@link document.leaving}
   */
    addEventListener(type: "unload", listener: (this: Window, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void;
}

interface Window {
    /** 
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/innerWidth) 
   * @deprecated
   * @migrate {@link window.width}
   */
    readonly innerWidth: number;

    /**
   * @deprecated
   * @migrate {@link document.ready}
   */
    addEventListener(type: "DOMContentLoaded", listener: (this: Document, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void;

    /**
   * @deprecated
   * @migrate {@link document.leaving}
   */
    addEventListener(type: "beforeunload", listener: (this: Window, ev: BeforeUnloadEvent) => unknown, options?: boolean | AddEventListenerOptions): void;

    /**
   * @deprecated
   * @migrate {@link document.leaving}
   */
    addEventListener(type: "unload", listener: (this: Window, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void;
}

interface Element {
    /** 
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/innerHTML) 
   * @deprecated
   * @migrate {@link HTMLElement.html}
   */
    innerHTML: string;
}

interface HTMLElement {
    /** 
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/innerText) 
   * @deprecated
   * @migrate {@link Element.txt}
   */
    innerText: string;
}