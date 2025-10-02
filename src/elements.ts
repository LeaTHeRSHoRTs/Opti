function toKebabCase(str: string): string {
  return str
    // Add a hyphen before uppercase letters that are preceded by lowercase letters or numbers
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    // Replace spaces or underscores with hyphens
    .replace(/[\s_]+/g, "-")
    // Convert everything to lowercase
    .toLowerCase();
}

export function hasText (this: Element, text: string | RegExp): boolean {
  if (typeof text === "string") {
    return this.txt().includes(text);
  } else {
    return text.test(this.txt());
  }
}

export function addClass (this: Element, elClass: string): void {
  this.classList.add(elClass);
}

export function removeClass (this: Element, elClass: string): void {
  this.classList.remove(elClass);
}

export function toggleClass (this: Element, elClass: string): void {
  this.classList.toggle(elClass);
}

export function hasClass (this: Element, elClass: string): boolean {
  return this.classList.contains(elClass);
}

export function css(
  this: HTMLElement,
  key?: keyof CSSStyleDeclaration | Partial<Record<keyof CSSStyleDeclaration, string | number>>,
  value?: string | number
): any {
  const css = this.style;

  if (!key) {
    // Return all styles
    const result: Partial<Record<keyof CSSStyleDeclaration, string>> = {};
    for (let i = 0; i < css.length; i++) {
      const prop = css[i];
      if (prop) {
        result[prop as keyof CSSStyleDeclaration] = css.getPropertyValue(prop).trim();
      }
    }
    return result;
  }

  if (typeof key === "string") {
    if (value === undefined) {
      // Get one value
      return css.getPropertyValue(key).trim();
    } else {
      // Set one value
      if (key in css) {
        css.setProperty(toKebabCase(key), value.toString());
      }
    }
  } else {
    // Set multiple
    for (const [prop, val] of Object.entries(key)) {
      if (val !== null && val !== undefined) {
        css.setProperty(toKebabCase(prop), val.toString());
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

export function html (this: Element, input?: string): string {
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

export function find(this: ParentNode, selector: string): Node | null {
  return this.querySelector(selector); // Returns a single Element or null
};

export function findAll(this: ParentNode, selector: string): NodeListOf<Element> {
  return this.querySelectorAll(selector); // Returns a single Element or null
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