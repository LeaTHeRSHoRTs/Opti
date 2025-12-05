export function hasText(this: Element, text: string | RegExp): boolean {
  if (typeof text === "string") {
    return this.txt().includes(text);
  } else {
    return text.test(this.txt());
  }
}

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

export function css(this: HTMLElement): CSSObject;
export function css(this: HTMLElement, key: CSSPropertyName): string | number;
export function css(this: HTMLElement, key: CSSPropertyName, value: string | number): void;
export function css(this: HTMLElement, key: CSSObject): void;
export function css(computed: true): CSSObject;
export function css(
  this: HTMLElement,
  key?: CSSPropertyName | CSSObject | true,
  value?: string | number
): CSSObject | string | number | void {
  const css = this.style;

  if (!key || key === true) {
    // Return all styles
    const result: CSSObject = {};
    for (let i = 0; i < css.length; i++) {
      const prop: CSSStyleDeclaration[number] = css[i];

      if (!prop) continue;

      const camelProp = dashToCamel(prop);
      const style = css.getPropertyValue(prop).trim();

      result[camelProp as keyof CSSStyleDeclaration] = parseUnit(style);
    }

    if (key === true) {
      const computed = getComputedStyle(this);
      const computedObj: CSSObject = {};

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
      return parseUnit(css.getPropertyValue(camelToDash(key)).trim());
    } else {
      // Set one value
      if (key in css) {
        css.setProperty(camelToDash(key), value.toString());
      }
    }
  } else {
    // Set multiple
    for (const [prop, val] of Object.entries(key)) {
      if (val !== null && val !== undefined) {
        css.setProperty(camelToDash(prop), val.toString());
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
  let el: Element | null = this instanceof Element ? this : this.parentElement;
  while (el) {
    if (el.matches(selector)) {
      return el as T;
    }
    el = el.parentElement;
  }
  return null;
}

export function html(this: Element, input?: string): string {
  return input !== undefined ? (this.innerHTML = input) : this.innerHTML;
};

export function text(this: Element, text?: string | ((text: string) => string), ...input: (string)[]): string {
  // If text is provided, update the textContent
  if (text !== undefined) {
    if (typeof text === "string") {
      input.unshift(text); // Add the text parameter to the beginning of the input array
      const joined = input.join(" "); // Join all the strings with a space

      // Replace "textContent" if it's found in the joined string (optional logic)
      this.textContent = joined.includes("textContent")
        ? joined.replace("textContent", this.textContent ?? "")
        : joined;
    } else {
      this.textContent = text(this.textContent ?? "");
    }
  }

  // Return the current textContent if no arguments are passed
  return this.textContent ?? "";
};

export function show(this: HTMLElement) {
  this.css("visibility", "visible");
};

export function hide(this: HTMLElement) {
  this.css("visibility", "hidden");
};

export function toggle(this: HTMLElement) {
  if (this.css("visibility") === "visible" || this.css("visibility") === "") {
    this.hide();
  } else {
    this.show();
  }
};

export function $(this: ParentNode, selector: string): Element | null {
  if (selector.includes(",")) throw new MalformedQueryException("Invalid query: commas are not allowed in query selectors that can only select 1 element");
  return this.querySelector<Element>(selector); // Returns a single Element or null
};

export function $$(this: ParentNode, selector: string): NodeListOf<Element> {
  return this.querySelectorAll<Element>(selector); // Returns a single Element or null
};

export function getChildren(this: Node): NodeListOf<ChildNode> {
  return this.childNodes;
};

export function getSiblings(this: ChildNode, inclusive?: boolean): ChildNode[] {
  const siblings = Array.from(this.parentNode!.childNodes);
  if (inclusive) {
    return siblings; // Include current node as part of siblings
  } else {
    return siblings.filter(node => !node.isSameNode(this));
  }
};

export function serialize(this: HTMLFormElement): string {
  const formData = new FormData(this); // Create a FormData object from the form

  // Create an array to hold key-value pairs
  const entries: [string, string][] = [];

  // Use FormData's forEach method to collect form data
  formData.forEach((value, key) => {
    entries.push([key, value.toString()]);
  });

  // Convert the entries into a query string
  return entries
    .map(([key, value]) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
    .join('&'); // Join the array into a single string, separated by '&'
};

export function cut<T extends Element>(this: T): T {
  const clone = document.createElementNS(this.namespaceURI, this.tagName) as T;

  // Copy all attributes
  for (const attr of Array.from(this.attributes)) {
    clone.setAttribute(attr.name, attr.value);
  }

  // Deep copy child nodes (preserves text, elements, etc.)
  for (const child of Array.from(this.childNodes)) {
    clone.appendChild(child.cloneNode(true));
  }

  // Optionally copy inline styles (not always needed if using setAttribute above)
  if (this instanceof HTMLElement && clone instanceof HTMLElement) {
    clone.style.cssText = this.style.cssText;
  }

  this.remove(); // Remove original from DOM

  return clone;
}

export function isVisible(this: HTMLElement) {
  return this.css("visibility") !== "hidden"
    ? this.css("display") !== "none"
    : Number(this.css("opacity")) > 0;
}

function as(this: HTMLInputElement, type: "number"): number | null;
function as(this: HTMLInputElement, type: "string"): string | null;
function as(this: HTMLInputElement, type: "boolean"): boolean | null;
function as(this: HTMLInputElement, type: "date"): Date | null;
function as(this: HTMLInputElement, type: string): string | number | boolean | Date | null {
  const value = this.value.trim();

  switch (type) {
    case "string":
      return value;

    case "number":
      const num = Number(value);
      return !isNaN(num) && value !== "" ? num : null;

    case "boolean":
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;

    case "date":
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date;

    default:
      return null;
  }
}

function parseTime(value: string) {
  const [h, m, s] = value.split(":");
  const [sec, ms] = (s ?? "0").split(".");
  const date = new Date();
  date.setHours(+h, +m, +sec, +ms || 0);
  return date;
}

export function val(self: HTMLInputElement): ValueAccessor {
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
    }
  };
};