// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function declare(f: (this: typeof globalThis, unsafe: any) => void): void {
  f.call(globalThis, globalThis);
}

export class OptiModuleError extends Error {
  constructor(submodule: string) {
    super(`Opti should be imported before the import for opti/${submodule}`, { cause: `Not importing opti before importing opti/${submodule}` });
  }
}

export class OptiInitError extends Error {}

export function setNotEnumerable<T, K extends keyof T>(obj: T, prop: K, val: T[K]): void {
  Object.defineProperty(obj, prop, {
    value: val,
    enumerable: false,
    writable: true,
    configurable: true
  });
}
 

export function setNameOfGlobalThisProp(cls: Stringed<keyof GlobalThis>): void {
  Object.defineProperty(globalThis[cls], "name", { value: cls });
}

export function setPropName<T, K extends Stringed<keyof T>>(cls: T, prop: K): void {
  Object.defineProperty(cls[prop], "name", { value: prop });
}


export function setGetter<T>(
  object: T,
  prop: keyof T,
  getter: () => unknown
): void {
  Object.defineProperty(object, prop, {
    get: getter,
    enumerable: false,
    configurable: true
  });
}

export function setReadOnly<T, K extends keyof T>(object: T, prop: K, val: T[K]): void {
  Object.defineProperty(object, prop, {
    value: val,
    enumerable: false,
    configurable: true
  });
}

export function supportsStyles(el: Element): el is HTMLElement | SVGElement | MathMLElement {
  return el instanceof HTMLElement || el instanceof SVGElement || el instanceof MathMLElement;
}

export function parseUnit(unit: string): string | number {
  if (/^0[^.]?/.test(unit)) return 0;
  if (!isNaN(Number(unit))) return Number(unit);
  return unit;
}

export function dashToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export function camelToDash(str: string): string {
  return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}