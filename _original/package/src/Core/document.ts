export function ready(callback: (this: Document, ev: Event) => unknown): void {
  document.addEventListener("DOMContentLoaded", callback);
}

let called = false;
export function leaving(callback: (this: Document, ev: Event) => unknown): void {
  if (called) return;

  function handler(e: Event) {
    try { callback.call(document, e); }
    finally { called = true; }
  }

  if ('onbeforeunload' in window) window.addEventListener('beforeunload', handler, { once: true });
  if ('onpagehide' in window) window.addEventListener('pagehide', handler, { once: true });
  document.addEventListener('visibilitychange', (e) => {
    if (document.visibilityState === 'hidden') handler(e);
  }, { once: true });
}

export function documentCss(
  element: keyof HTMLElementTagNameMap
): Partial<Record<keyof CSSStyleDeclaration, string>>;
export function documentCss(
  element: keyof HTMLElementTagNameMap,
  object: Partial<Record<keyof CSSStyleDeclaration, string | number>>
): void;
export function documentCss(
  element: string
): Partial<Record<keyof CSSStyleDeclaration, string>>;
export function documentCss(
  element: string,
  object: Partial<Record<keyof CSSStyleDeclaration, string | number>>
): void;
export function documentCss(
  element: string,
  object?: Partial<Record<keyof CSSStyleDeclaration, string | number>>
): Partial<Record<keyof CSSStyleDeclaration, string>> | void {
  const selector = element.trim();
  if (!selector) {
    throw new globalThis.SyntaxException("Selector cannot be empty.");
  }

  let styleTag: HTMLStyleElement | null = document.querySelector<HTMLStyleElement>("style[js-styles]");

  if (!styleTag) {
    styleTag = document.createElement<"style">("style");
    styleTag.setAttribute("js-styles", "");
    document.head.appendChild(styleTag);
  }

  const sheet = styleTag.sheet as CSSStyleSheet;
  let ruleIndex = -1;
  const existingStyles: StringRecord<string> = {};

  for (let i = 0; i < sheet.cssRules.length; i++) {
    const rule = sheet.cssRules[i];
    if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
      ruleIndex = i;
      const declarations = rule.style;
      for (let j = 0; j < declarations.length; j++) {
        const name = declarations[j];
        if (!name) continue;

        existingStyles[name] = declarations.getPropertyValue(name).trim();
      }
      break;
    }
  }

  if (!object || Object.keys(object).length === 0) {
    return existingStyles;
  }

  // Convert camelCase to kebab-case
  const newStyles: StringRecord<string> = {};
  for (const [prop, val] of Object.entries(object)) {
    if (val !== null && val !== undefined) {
      const kebab = prop.toString().replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
      newStyles[kebab] = val.toString();
    }
  }

  const mergedStyles = { ...existingStyles, ...newStyles };
  const styleString = Object.entries(mergedStyles)
    .map(([prop, val]) => `${prop}: ${val};`)
    .join(" ");

  if (ruleIndex !== -1) {
    sheet.deleteRule(ruleIndex);
  }

  try {
    sheet.insertRule(`${selector} { ${styleString} }`, sheet.cssRules.length);
  } catch (err) {
    console.error("Failed to insert CSS rule:", err, { selector, styleString });
  }
}