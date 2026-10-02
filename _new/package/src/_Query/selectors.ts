import { _InternalQueryPseudoElement } from "./styleElement";
import { transformQuery } from "./parsers";

function _$(this: ParentNode, selector: string): HTMLElement | Query.PseudoElement | null {
  // eslint-disable-next-line prefer-const
  let [res, processors] = transformQuery(selector);
  let el: HTMLElement | Query.PseudoElement | null = document.querySelector(res);

  if (processors.length > 0) {
    const process = res.split(/\x01[^\x01]+\x01/)[0] ?? "";
    const processedEl = document.querySelector(process);

    res = res.remove(/\x01[^\x01]+\x01/);
  }

  return el;
};

_$.query = () => new QueryBuilder(false);

_$.assert = function<T extends HTMLTag>(this: ParentNode, selector: string, tag: T): HTMLElementOf<T> | null {
  return this.querySelector<HTMLElementOf<T>>(selector);
};

_$.all = function (this: ParentNode, selector: string): [HTMLElement, ...HTMLElement[]] | null {
  throw new NotImplementedException();
};

_$.tear = function (this: ParentNode, selector: string): HTMLElement {
  throw new NotImplementedException();
};

_$.explicit = function<T extends HTMLTag>(this: ParentNode, selector: string, tag: T): HTMLElementOf<T> | null {
  return this.querySelector<HTMLElementOf<T>>(selector);
};

_$.with = function(this: ParentNode, selector: string): HTMLElement | null {
  throw new NotImplementedException();
};

export const $ = _$ satisfies Query.$;

function _$$(this: ParentNode, selector: string): HTMLElement[] {
  return Array.from(this.querySelectorAll(selector));
}

_$$.all = function (this: ParentNode, selector: string): HTMLElement[][] {
  throw new NotImplementedException();
};

_$$.assert = function (this: ParentNode, selector: string) {
  return <T extends HTMLTag>(tag: T): HTMLElementOf<T>[] => {
    const arr = Array.from(this.querySelectorAll<HTMLElementOf<T>>(selector));

    arr.forEach(i => {
      assert(i.tagName.toLowerCase() === tag.toLowerCase());
    });

    return arr;
  };
};

_$$.query = () => new QueryBuilder(true);

_$$.explicit = function<T extends HTMLTag>(this: ParentNode, selector: string, tag: T): HTMLElementOf<T>[] {
  return Array.from(this.querySelectorAll<HTMLElementOf<T>>(selector));
};

_$$.with = function(this: ParentNode, selector: string): HTMLElement[] {
  throw new NotImplementedException();
};

_$$.tear = function(this: ParentNode, selector: string): HTMLElement[] {
  throw new NotImplementedException();
};

export const $$ = _$$ satisfies Query.$$;

class QueryBuilder {
  #queryString: string[] = [];
  #multi: boolean;

  constructor(multi: boolean) { 
    this.#multi = multi;
  }

  public is(selector: string): this {
    this.#queryString.push(`:is(${selector})`);
    return this;
  }

  public isnt(selector: string) {
    this.#queryString.push(`:not(${selector})`);
    return this;
  }
}