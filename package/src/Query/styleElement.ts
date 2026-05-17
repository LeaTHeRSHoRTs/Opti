import { dashToCamel, parseUnit } from "../helpers";

export class Internal_QueryPseudoElement<T extends Element> {
  #parent: T;
  #type: '::before' | '::after';

  constructor(parent: T, type: '::before' | '::after') {
    this.#parent = parent;
    this.#type = type;
  }

  css(): CSS.Object;
  css(ket: CSS.PropertyName): string | number | undefined;
  css(key?: CSS.PropertyName): string | number | undefined | CSS.Object {
    const styles = window.getComputedStyle(this.#parent, this.#type);

    if (key) {
      return styles.getPropertyValue(key);
    } else {
      const result: CSS.Object = {};
      for (let i = 0; i < styles.length; i++) {
        const prop: CSSStyleDeclaration[number] = styles[i] as CSSStyleDeclaration[number];

        if (!prop) continue;

        const value = styles.getPropertyValue(prop).trim();

        const finalKey = prop.startsWith('--') ? prop : dashToCamel(prop);
        result[finalKey as keyof CSSStyleDeclaration] = parseUnit(value);
      }
      return result;
    }
  }

  exists(): boolean {
    const content = window.getComputedStyle(this.#parent, this.#type).content;
    return content !== 'none' && content !== 'normal';
  }
}

Object.defineProperty(Internal_QueryPseudoElement, "name", { value: "QueryStyleElement" });