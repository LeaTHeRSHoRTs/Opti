export function setNameOfGlobalThisProp(cls: keyof GlobalThis, name: string): void {
  Object.defineProperty(globalThis[cls], "name", { value: name });
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

export function setReadOnly(object: unknown, prop: string, val: unknown): void {
  Object.defineProperty(object, prop, {
    value: val,
    enumerable: false,
    configurable: true
  });
}