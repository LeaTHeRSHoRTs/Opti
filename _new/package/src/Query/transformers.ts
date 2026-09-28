import { _InternalQueryPseudoElement } from "./styleElement";

//* Refiners

export function hasText(el: Element | null, text: string): Element | null {
  if (!el) return null;
  return el.txt().includes(text) ? el : null;
}

export function before(el: Element | null): Query.PseudoElement | null {
  if (!el) return null;
  return new _InternalQueryPseudoElement(el, '::before');
}

export function after(el: Element | null): Query.PseudoElement | null {
  if (!el) return null;
  return new _InternalQueryPseudoElement(el, '::after');
}

//* Transformers
export function styles(selector: string | undefined, styleList: string): string {
  const styleString = styleList
    .split(',')
    .map(s => `[style*="${s.replace('=', ': ').trim()}"]`)
    .join('');
  return (selector ?? "") + styleString;
}

export function parent(selector?: string, parentEl?: string): string {
  return `${parentEl ?? ""}:has(> ${selector})`;
}

export function hidden(selector?: string): string {
  return `${selector}:has([style*="display: none"], [style*="visibility: hidden"], [style*="width: 0"][style*="height: 0"])`;
}

export function visible(selector?: string): string {
  return `${selector}:not([style*="display: none"]):not([style*="visibility: hidden"])`;
}