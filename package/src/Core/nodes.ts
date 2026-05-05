/// <reference path="../../types/Unsync/unsync.lib.d.ts" />

export function addClass(this: Element, elClass: string): void {
  this.classList.add(elClass);
}

export function removeClass(this: Element, elClass: string): void {
  this.classList.remove(elClass);
}

export function toggleClass(this: Element, elClass: string): void {
  this.classList.toggle(elClass);
}

export function hasClass(this: Element, elClass: string): boolean {
  return this.classList.contains(elClass);
}

function parseUnit(unit: string): string | number {
  if (/^0[^.]?/.test(unit)) return 0;
  if (!isNaN(Number(unit))) return Number(unit);
  return unit;
}

function dashToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// camelCase ("backgroundColor") → dash-case ("background-color")
function camelToDash(str: string): string {
  return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

export function css(this: HTMLElement): CSS.Object;
export function css(this: HTMLElement, key: CSS.PropertyName): string | number;
export function css(this: HTMLElement, key: CSS.PropertyName, value: string | number | null): void;
export function css(this: HTMLElement, key: CSS.Object): void;
export function css(computed: true): CSS.Object;
export function css(
  this: HTMLElement,
  key?: CSS.PropertyName | CSS.Object | true,
  value?: string | number | null
): CSS.Object | string | number | void {
  const icss = this.style;

  // If request for computed styles or all styles
  if (!key || key === true) {
    // Return all styles
    const result: CSS.Object = {};
    for (let i = 0; i < icss.length; i++) {
      const prop: CSSStyleDeclaration[number] = icss[i] as CSSStyleDeclaration[number];

      if (!prop) continue;

      const camelProp = dashToCamel(prop);
      const style = icss.getPropertyValue(prop).trim();

      result[camelProp as keyof CSSStyleDeclaration] = parseUnit(style);
    }

    if (key === true) {
      const computed = window.getComputedStyle(this);
      const computedObj: CSS.Object = {};

      for (let i = 0; i < computed.length; i++) {
        const prop = computed[i];
        if (!prop) continue;
        const camelProp = dashToCamel(prop);
        const style = computed.getPropertyValue(prop).trim();
        computedObj[camelProp as keyof CSSStyleDeclaration] = parseUnit(style);
      }
      
      return { ...result, ...computedObj };
    }

    return result;
  }

  if (typeof key === "string") {
    if (value === undefined) {
      return parseUnit(icss.getPropertyValue(camelToDash(key)).trim());
    } else if (value === null) {
      icss.removeProperty(camelToDash(key));
    } else {
      // Set one value
      if (key in icss) {
        icss.setProperty(camelToDash(key), value.toString());
      }
    }
  } else {
    // Set multiple
    for (const [prop, ival] of Object.entries(key)) {
      if (ival !== null && ival !== undefined) {
        icss.setProperty(camelToDash(prop.toString()), ival.toString());
      }
    }
  }
};

export function getParent(this: ChildNode): ParentNode | null {
  return this.parentElement;
};

export function getAncestor<T extends Element>(this: ChildNode, arg: string | number): T | Node | null {
  // Case 1: numeric level
  if (typeof arg === "number") {
    let node: Node | null = this;
    for (let i = 0; i < arg; i++) {
      if (!node?.parentNode) return null;
      node = node.parentNode;
    }
    return node;
  }

  // Case 2: selector string
  const selector = arg;
  let el = this instanceof Element ? this : this.parentElement;
  while (el) {
    if (el.matches(selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

export function html(this: Element, input?: string): string {
  return input !== undefined ? (this.innerHTML = input) : this.innerHTML;
};

export function text(this: Element, internalText?: string | ((oldText: string) => string), ...input: string[]): string {
  // If text is provided, update the textContent
  if (internalText !== undefined) {
    if (typeof internalText === "string") {
      input.unshift(internalText); // Add the text parameter to the beginning of the input array
      const joined = input.join(" "); // Join all the strings with a space

      // Replace "textContent" if it's found in the joined string (optional logic)
      this.textContent = joined.includes("textContent")
        ? joined.replace("textContent", this.textContent ?? "")
        : joined;
    } else {
      this.textContent = internalText(this.textContent ?? "");
    }
  }

  // Return the current textContent if no arguments are passed
  return this.textContent ?? "";
};

export function show(this: HTMLElement): void {
  this.css("visibility", "visible");
};

export function hide(this: HTMLElement): void {
  this.css("visibility", "hidden");
};

export function toggle(this: HTMLElement): void {
  if (this.css("visibility") === "visible" || this.css("visibility") === "") {
    this.hide();
  } else {
    this.show();
  }
};

export function $(this: ParentNode, selector: string): Element | null {
  if (selector.includes(",")) throw new SyntaxException("Invalid query: commas are not allowed in query selectors that can only select 1 element");
  return this.querySelector(selector);
};

export function $$(this: ParentNode, selector: string): Element[] {
  return Array.from(this.querySelectorAll(selector));
};

export function getChildren(this: Node): NodeListOf<ChildNode> {
  return this.childNodes;
};

export function getSiblings(this: ChildNode, inclusive?: boolean): ChildNode[] {
  if (!this.parentNode) return[];

  const siblings = Array.from(this.parentNode.childNodes);
  if (inclusive) {
    return siblings; // Include current node as part of siblings
  } else {
    return siblings.filter(node => !node.isSameNode(this));
  }
};

export function serialize(this: HTMLFormElement): string {
  const formData = new FormData(this);

  const entries: [string, string][] = [];

  formData.forEach((value, key) => {
    entries.push([key, value.toString()]);
  });

  return entries
    .map(([key, value]) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
    .join('&');
};

export function cut<T extends Node>(this: T): T {
  if (!this.parentNode) throw new HierarchyException("Element cannot be cut out of the DOM because it has no parent");
  this.parentNode.removeChild(this);
  return this;
}

const defaultCopy: Required<Element.CopyOptions> = {
  copyAll: false,
  copyAttributes: true,
  copyChildren: false,
  copyEvents: false,
  copyStyles: true
};

function isEventTarget(obj: Partial<EventTarget>): obj is EventTarget {
  return (obj && 
         typeof obj.addEventListener === "function" &&
         typeof obj.removeEventListener === "function" &&
         typeof obj.dispatchEvent === "function");
}

type _EventsRecord<T extends EventTarget> = { [K in keyof EventMapOf<T>]?: EventListenerInfo<T, K>[] };

export function copy<T extends Element>(this: T, object: Element.CopyOptions): T;
export function copy<T extends Element>(this: T, children?: boolean, events?: boolean): T;
export function copy<T extends Element>(this: T, childrenOrObject?: boolean | Element.CopyOptions, events?: boolean): T;
export function copy<T extends Element>(this: T, childrenOrObject: boolean | Element.CopyOptions = true, events: boolean = false): T {
  let options: Required<Element.CopyOptions>;
  if (typeof childrenOrObject === "boolean") {
    options = { 
      ...defaultCopy, 
      copyChildren: childrenOrObject, 
      copyEvents: events 
    };
  } else {
    options = { 
      ...defaultCopy,
      ...childrenOrObject
    };
  }

  const clone = document.createElementNS(this.namespaceURI, this.tagName) as T;

  if (options.copyAttributes || options.copyAll) {
    for (const attr of Array.from(this.attributes)) {
      clone.setAttribute(attr.name, attr.value);
    }
  }

  if (options.copyChildren || options.copyAll) {
    for (const child of Array.from(this.childNodes)) {
      clone.appendChild(child.cloneNode(true));
    }
  }

  if (options.copyStyles || options.copyAll) {
    if (this instanceof HTMLElement && clone instanceof HTMLElement) {
      clone.style.cssText = this.style.cssText;
    }
  }

  if ((options.copyEvents || options.copyAll) && isEventTarget(this)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const [event, funcs] of Object.entries((this as any)._events) as [keyof EventMapOf<T>, _EventsRecord<T>[keyof EventMapOf<T>]][]) {
      funcs?.forEach(prop => {
        if (Opti.unsync /* Unsync is active */) {
          switch (prop.listener) {
            case "default": break;
            case "conditional":
              return this.addConditionalListener(event, prop.func, prop.special, prop.options);
            case "controller":
              return this.addEventController(event, prop.func, prop.options);
          }
        }

        this.addEventListener(event as string, prop.func as EventListener, prop.options);
      });
    }
  }

  return clone;
}

export function isVisible(this: HTMLElement): boolean {
  if (!this.isConnected) return false;
  
  const elCss = window.getComputedStyle(this);

  return (
    elCss.display !== "none" &&
    elCss.visibility !== "hidden" &&
    parseFloat(elCss.opacity) > 0
  );
}

function parseTime(value: string) {
  const [h, m, s] = value.split(":");
  const [sec, ms] = (s ?? "0").split(".");
  const date = new Date();
  date.setHours(+(h || 0), +(m || 0), +(sec || 0), +(ms || 0));
  return date;
}

export function val(this: HTMLInputElement): HTMLInputElement.ValueAccessor {
  const self = this;

  return {
    asBoolean(): boolean | null {
      switch (self.type) {
        case "checkbox":
        case "radio":
          return self.checked;

        // Other input types: only return boolean if value itself is explicitly "true" or "false"
        default:
          if (self.value === "true") return true;
          if (self.value === "false") return false;

          // For anything else (text, number, etc.), it doesn’t represent a boolean meaningfully
          return null;
      }
    },
    asNumber() {
      const num = self.valueAsNumber;
      return Number.isNaN(num) ? null : num;
    },
    asDate() {
      let date = self.valueAsDate;
      if (!date && self.type === "time") date = parseTime(self.value);
      return date;
    },
    asString() {
      return self.value ?? "";
    },
    inferred() {
      return this.asDate() || this.asBoolean() || this.asNumber() || this.asString();
    },
    get type() {
      return self.type;
    }
  };
};