import { transformQuery } from './parsers';

function _$(this: ParentNode, selector: string): HTMLElement | null {
    // eslint-disable-next-line prefer-const
    let [res, processors] = transformQuery(selector);
    const el: HTMLElement | null = document.querySelector(res);

    if (processors.length > 0) {
        const process = res.split(/\x01[^\x01]+\x01/)[0] ?? "";
        const processedEl = document.querySelector(process);

        res = res.remove(/\x01[^\x01]+\x01/);
    }

    return el;
};

_$.assert = function<T extends HTMLTag>(this: ParentNode, selector: string, tag: T): HTMLElementOf<T> | null {
    return this.querySelector<HTMLElementOf<T>>(selector);
};

_$.all = function (this: ParentNode, selector: string): Arr<HTMLElement> {
    throw new NotImplementedError();
};

_$.tear = function (this: ParentNode, selector: string): HTMLElement {
    throw new NotImplementedError();
};

_$.explicit = function<T extends HTMLTag>(this: ParentNode, selector: string, tag: T): HTMLElementOf<T> | null {
    return this.querySelector<HTMLElementOf<T>>(selector);
};

_$.with = function(this: ParentNode, selector: string): HTMLElement | null {
    throw new NotImplementedError();
};

export const $ = _$ satisfies Query.$;

function _$$<T extends Element = HTMLElement>(this: ParentNode, selector: string): Arr<T> {
    return Array.from(this.querySelectorAll<T>(selector)).asArr();
}

_$$.all = function<T extends Element = HTMLElement>(this: ParentNode, selector: string): Arr<Arr<T>> {
    throw new NotImplementedError();
};

_$$.assert = function(this: ParentNode, selector: string) {
    return <T extends HTMLTag>(tag: T): Arr<HTMLElementOf<T>> => {
        const arr = Array.from(this.querySelectorAll<HTMLElementOf<T>>(selector));

        arr.forEach(i => {
            assert(i.tagName.toLowerCase() === tag.toLowerCase());
        });

        return arr.asArr();
    };
};

_$$.explicit = function<T extends HTMLTag>(this: ParentNode, selector: T): Arr<HTMLElementOf<T>> {
    return Array.from(this.querySelectorAll<HTMLElementOf<T>>(selector)).asArr();
};

_$$.with = function<T extends Element = HTMLElement>(this: ParentNode, selector: string): Arr<T> {
    throw new NotImplementedError();
};

_$$.tear = function<T extends Element = HTMLElement>(this: ParentNode, selector: string): Arr<T> {
    throw new NotImplementedError();
};

export const $$ = _$$ satisfies Query.$$;