import "@unsync";
import { camelToDash, dashToCamel, parseUnit, parseTime } from "../helpers";

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

export function txt(modifier: (text: string) => string): void;
export function txt(newText_0: string, ...newText: string[]): void;
export function txt(): string;
export function txt(this: Element, modifier?: ((text: string) => string) | string, ...newText: string[]): string {
  // If text is provided, update the textContent
  if (modifier !== undefined) {
    if (typeof modifier === "string") {
      const inputText = [...newText];
      inputText.unshift(modifier);
      this.textContent = inputText.join(" ");
    } else {
      this.textContent = modifier(this.textContent);
    }
  }
  return this.textContent;
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

export function cut<T extends Node>(this: T): void {
  if (!this.parentNode) throw new HierarchyException("Element cannot be cut out of the DOM because it has no parent");

  if ("remove" in this && typeof this.remove === 'function') {
    this.remove();
  } else {
    this.parentNode.removeChild(this);
  }
}

const defaultCopy: Required<Omit<Element.CopyOptions, 'fallbackId'>> = {
  copyAll: false,
  copyAttributes: true,
  copyChildren: false,
  copyStyles: true
};

export function copy<T extends Element>(this: T, object: Element.CopyOptions): T;
export function copy<T extends Element>(this: T, children?: boolean): T;
export function copy<T extends Element>(this: T, childrenOrObject?: boolean | Element.CopyOptions): T;
export function copy<T extends Element>(this: T, childrenOrObject: boolean | Element.CopyOptions = true): T {
  const incomingOptions: Element.CopyOptions = typeof childrenOrObject === "boolean"
    ? { copyChildren: childrenOrObject }
    : (childrenOrObject ?? {});

  // 2. Merge defaults cleanly. TypeScript guarantees full type safety here.
  const options = { ...defaultCopy, ...incomingOptions };

  const clone = document.createElementNS(this.namespaceURI, this.tagName) as T;

  if (options.copyAttributes || options.copyAll) {
    if (this instanceof HTMLElement && clone instanceof HTMLElement) {
      if (this.title) clone.title = this.title;
      if (this.role) clone.role = this.role;
      if (this.ariaChecked) clone.ariaChecked = this.ariaChecked;
      clone.hidden = this.hidden;
      clone.tabIndex = this.tabIndex;
      
      // Sync datasets securely
      Object.assign(clone.dataset, this.dataset);
    }

    for (const attribute of Array.from(this.attributes)) {
      // Skip styles (so that copyStyles works)
      if (attribute.name === "style") continue; 
      if (attribute.name === "id" && attribute.value !== "") {
        if (!options.fallbackId) {
          console.warn("Fallback ID is not set. Skipping application of ID");
          clone.id = "";
          continue;
        } else {
          clone.id = options.fallbackId;
          continue;
        }
      }
      
      clone.setAttribute(attribute.name, attribute.value);
    }
  }

  if (options.copyChildren || options.copyAll) {
    if (!this.children.length && this.innerHTML) {
      clone.innerHTML = this.innerHTML;
    } else {
      for (const child of Array.from(this.childNodes)) {
        let childCopy: Node;
        if (child instanceof Element) {
          const optionsCopy = {...options};
          delete optionsCopy.fallbackId;
          childCopy = child.copy(optionsCopy);
        } else {
          childCopy = child.cloneNode(true);
        }

        clone.appendChild(childCopy);
      }
    }
  }

  if (options.copyStyles || options.copyAll) {
    if (this instanceof HTMLElement && clone instanceof HTMLElement) {
      clone.style.cssText = this.style.cssText;
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

export function attr<T extends Element, K extends keyof T>(this: T, key: K, value?: T[K]): T[K] | void {
  if (value)  this[key] = value;
  else return this[key];
}