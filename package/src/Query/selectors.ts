import { supportsStyles, camelToDash } from "../helpers/helpers";
import { Internal_QueryPseudoElement } from "./styleElement";

const SIMPLE  = Symbol("SIMPLE");
const PARSE   = Symbol("PARSE");
const PASS_ON = Symbol("PASS_ON");
type SIMPLE  = typeof SIMPLE;
type PARSE   = typeof PARSE;
type PASS_ON = typeof PASS_ON;

interface SimpleConfig {
  type: SIMPLE;
  handler: (queryString: string) => string;
}

type ParseConfig = {
  type: PARSE,
  value: true,
  handler?: (el: Element, value: string) => boolean
} | {
  type: PARSE,
  value?: false,
  handler?: (el: Element) => boolean
};

type SimpleOrParseConfig = SimpleConfig | ParseConfig;

const selectorMap = {
  hidden: {
    type: PARSE,
    handler(el): boolean {
      return selectorMap.visible.handler(el);
    },
  },
  visible: {
    type: PARSE,
    handler(el): boolean {
      if (!(el instanceof HTMLElement)) throw new Query.MalformedQueryException("Selector ':hidden' cannot be used on non-HTML elements");

      const style = el.css(true);
      if (el.offsetParent === null && style.position !== 'fixed') {
        return false;
      }
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity as number > 0 &&
        el.offsetWidth > 0 &&
        el.offsetHeight > 0
      );
    },
  },
  event: {
    type: PARSE,
    handler(el, value) {
      
    },
  },
  hasText: {
    type: PARSE,
    handler(el, value) {
      
    },
  },
  before: {
    type: PARSE,
    handler(el, value) {
      
    },
  },
  after: {
    type: PARSE,
    handler(el, value) {
      
    },
  },
  parent: {
    type: PARSE,
    handler(el, value) {
      
    },
  },
  styleExternal: {
    type: PARSE,
    handler(el, value) {
      
    },
  },
  styles: {
    type: PARSE,
    handler(el, value) {
      
    },
  },
  thisFirstChild: {
    type: SIMPLE,
    handler(queryString) {
      
    },
  },
  thisLastChild: {
    type: SIMPLE,
    handler(queryString) {
      
    },
  },
  thisNthChild: {
    type: SIMPLE,
    handler(queryString) {
      
    },
  }
} satisfies Record<string, SimpleOrParseConfig>;

type FilterMap = Record<string, QueryCustom>;

function parseQuery(extString: string): [string, FilterMap] {
  let queryString = extString;
  const filterMap: FilterMap = {};

  function set<K extends keyof QueryCustom>(internalSelector: string | undefined, prop: K, value: QueryCustom[K]): void {
    if (!internalSelector) throw new Query.MalformedQueryException(`Property ${prop} must be accompanied by an element.`);

    filterMap[internalSelector] ??= {};
    filterMap[internalSelector][prop] = value;
  }

  function replace(regex: RegExp, filter: (...inner: string[]) => string | void): void {
    queryString = queryString.replace(regex, (_, ...inner: string[]) => {
      return filter(...inner) ?? "";
    });
  }

  queryString = queryString.trim();

  // ::before
  replace(/(.+?)::before$/, (...inner) => {
    set(inner[0], "before", SIMPLE);
  });

  // ::after
  replace(/(.+?)::after$/, (...inner) => {
    set(inner[0], "before", SIMPLE);
  });

  replace(/(.+?):parent/g, (...inner) => {
    set(inner[0], "parent", SIMPLE);
  });

  // :this-first-child
  replace(/(.+?):this-first-child/g, (...inner) => {
    set(inner[0], "thisFirstChild", inner[0]);
  });

  // :this-last-child
  replace(/(.+?):this-last-child/g, (...inner) => {
    set(inner[0], "thisLastChild", inner[0]);
  });

  // :this-nth-child
  replace(/(.+?):this-nth-child(\d+)/g, (...inner) => {
    set(inner[0], "thisNthChild", [inner[0], Number(inner[1])]);
  });

  // :inline-style(...styles)
  replace(/(.+?):inline-style\(([\w]+[=:][\w\d];?)+\)/g, (...inner) => {
    const selector = inner[0]; // selector
    const inners = inner[1]?.split(",").map(v => v.trim()); // ...:inline-style([...styles])

    const expanded = inners?.map(style => `[style*=${style}]`).join("");

    return expanded;
  });

  // :external-style(...styles)
  replace(/(.+?):external-style\(([\w]+[=:][\w\d]\w*;?\w*)+\)/g, (...inner) => {
    set(inner[0], "styleExternal", inner[1]?.split(";").map(s => s.trim()) ?? []);
  });

  // :style(...styles)
  replace(/(.+?):style\(([\w]+[=:][\w\d]\w*;?\w*)+\)/g, (...inner) => {
    set(inner[0], "styles", inner[1]?.split(";").map(s => s.trim()) ?? []);
  });

  // :hasText(...text)
  replace(/(.+?):hasText\(([^)(]+)\)/g, (...inner) => {
    set(inner[0], "hasText", inner[1]?.split(",").map(v => v.trim()).filter(Boolean) ?? []);
  });

  // :has(...selectors)
  replace(/(.+?):has\(([^)]+)\)/g, (...inner): string => {
    const selector = inner[0]; // selector
    const inners = inner[1]?.split(",").map(v => v.trim()); // ...:has([...selectors])

    const expanded = inners?.map(child => `${selector} > ${child}`).join(", ");

    return `:is(${expanded})`;
  });

  // :hidden
  replace(/(.+?):hidden/g, (...inner) => {
    set(inner[0], "hidden", true);
    return "";
  });

  // :visible
  replace(/(.+?):visible/g, (...inner) => {
    set(inner[0], "visible", true);
  });

  // :event(...events)
  replace(/(.+?):event\(([a-z,\s]*)\)/g, (...inner) => {
    set(inner[0], "event", inner[1]?.split(",").map(v => v.trim()).filter(Boolean) ?? []);
  });

  tokenise(queryString).slice(1).forEach(() => {

  });

  return [queryString, filterMap];
}

interface ValidatorResults {
  before: Query.PseudoElement | false;
  after: Query.PseudoElement | false;
  thisFirstChild: string;
  thisLastChild: string;
  thisNthChild: string;
};

function tokenise(queryString: string) {
  return queryString.match(/((?:[^\s()]|\([^)]*\))+|[>+~])/g) || [];
}

type Validator<K extends keyof QueryCustom> = 
  (el: Element, ...value: NonNullable<QueryCustom[K]> extends true ? [] : [value: QueryCustom[K]]) => K extends keyof ValidatorResults ? ValidatorResults[K] : boolean;
const Validators = {
  hidden(el): boolean {
    return !this.visible(el);
  },
  visible(el): boolean {
    
  },
  event(el, value): boolean {
    throw new Error("Function not implemented.");
  },
  hasText(el, strings): boolean {
    if (!strings) return false;

    const elText = el.txt();

    return strings.length > 0 && strings.every(text => elText.includes(text));
  },
  before(el): Query.PseudoElement { return new Internal_QueryPseudoElement(el, '::before'); },
  after (el): Query.PseudoElement { return new Internal_QueryPseudoElement(el, '::before'); },
  parent(el): boolean {
    throw new Error("Function not implemented.");
  },
  styleExternal(el, values): boolean {
    if (supportsStyles(el)) return false;
    if (!values || values.length === 0) {
      throw new Query.MalformedQueryException("No values provided for :styleExternal");
    }

    const styles = window.getComputedStyle(el);

    return values.every(prop => {
      const val = styles.getPropertyValue(prop);
      return val !== "" && val !== null;
    });
  },
  styles(el, values): boolean {
    if (!supportsStyles(el)) return false;
    if (!values || values.length === 0) throw new Query.MalformedQueryException("the `styles` selector must contain at least 1 style to check");

    const styles = el.style;

    return values.every(prop => {
      const val = styles.getPropertyValue(camelToDash(prop));
      return val !== "" && val !== null;
    });
  },
  thisFirstChild(el, v): string {
    return "";
  },
  thisLastChild(el, v): string {
    return "";
  },
  thisNthChild(el, [str, num]): string {
    return "";
  }
};

function _$(this: ParentNode, selector: string): HTMLElement | null {
  const [queryString, map] = parseQuery(selector);

  const collection = Array.from(this.querySelectorAll<HTMLElement>(queryString));

  if (collection?.length <= 0) return null;

  for (const el of collection) {
    for (const [queriedElement, checks] of Object.entries(map)) {
      //* :event(...ev)
      // if (checks.event && (el.event || !Object.keys(checks.event).every(ev => el.event?.includes(ev)))) {
      //   continue;
      // }

      //* :hidden, :visible
      if (checks.hidden || checks.visible) {
        const display = el.css("display") || getComputedStyle(el).display;
        const visibility = el.css("visibility") || getComputedStyle(el).visibility;
        const opacity = el.css("opacity") || getComputedStyle(el).opacity;

        // If any of these are NOT hiding the element, continue (skip)
        const status = (display !== "none" || visibility !== "hidden" || opacity !== "0") ? "visible" : "hidden";

        if (map.hidden && status !== "hidden") continue;
        if (map.visible && status !== "visible") continue;
      }

      if (checks.hasText) {
        if (!checks.hasText.every(text => el.txt().includes(text))) {
          continue;
        }
      }

      return el;
    }
  }

  return null;
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