/* eslint-disable jsdoc/require-tags, jsdoc/require-param, jsdoc/require-example */

declare interface ParentNode extends Node {
    /** @deprecated Use {@link Node.parent} instead. */
    readonly parentElement: HTMLElement | null;

    /** @deprecated Use {@link Node.parent} instead. */
    readonly parentNode: ParentNode | null;

    /** @deprecated Use {@link Node.$} instead. */
    //@ts-expect-error
    querySelector: ParentNode['querySelector'];

    /** @deprecated Use {@link Node.$$} instead. */
    //@ts-expect-error
    querySelectorAll: ParentNode['querySelectorAll'];

    /** @deprecated Use {@link Element.txt} instead. */
    textContent: string | null;
}

interface Document {
    /** @deprecated Use {@link document.ready} instead. */
    addEventListener(type: 'DOMContentLoaded', listener: (this: Document, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void;

    /** @deprecated Use {@link document.ready} instead. */
    addEventListener(type: 'load', listener: (this: Document, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void;

    /** @deprecated Use {@link document.leaving} instead. */
    addEventListener(type: 'unload', listener: (this: Window, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void;
}

interface Window {
    /** @deprecated Use {@link window.width} instead. See https://developer.mozilla.org/docs/Web/API/Window/innerWidth */
    readonly innerWidth: number;

    /** @deprecated Use {@link document.ready} instead. */
    addEventListener(type: 'DOMContentLoaded', listener: (this: Document, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void;

    /** @deprecated Use {@link document.leaving} instead. */
    addEventListener(type: 'beforeunload', listener: (this: Window, ev: BeforeUnloadEvent) => unknown, options?: boolean | AddEventListenerOptions): void;

    /** @deprecated Use {@link document.leaving} instead. */
    addEventListener(type: 'unload', listener: (this: Window, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void;
}

interface Element {
    /** @deprecated Use {@link HTMLElement.html} instead. See https://developer.mozilla.org/docs/Web/API/Element/innerHTML */
    innerHTML: string;
}

interface HTMLElement {
    /** @deprecated Use {@link Element.txt} instead. See https://developer.mozilla.org/docs/Web/API/HTMLElement/innerText */
    innerText: string;
}