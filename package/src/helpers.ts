export function arrType<T extends Class.Constructor | StringConstructor | NumberConstructor | BooleanConstructor | SymbolConstructor>(
        array: unknown[],
        type: T
): array is Unboxed<T>[] {
    return array.every(v =>
            type === String ? typeof v === "string" :
            type === Number ? typeof v === "number" :
            type === Boolean ? typeof v === "boolean" :
            type === Symbol ? typeof v === "symbol" :
            v instanceof type
    );
}

export function isEventTarget(obj: Partial<EventTarget>): obj is EventTarget {
    return (obj &&
            typeof obj.addEventListener === "function" &&
            typeof obj.removeEventListener === "function" &&
            typeof obj.dispatchEvent === "function");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function declare(f: (this: typeof globalThis, unsafe: any) => void): void {
    f.call(globalThis, globalThis);
}

export function createModuleError(submodule: string): Error {
    return new Error(`Opti should be imported before the import for opti/${submodule}`, {
        cause: `Not importing opti before importing opti/${submodule}`
    });
}

export function setNotEnumerable<T, K extends keyof T>(obj: T, prop: K, val: T[K]): void {
    Object.defineProperty(obj, prop, {
        value: val,
        enumerable: false,
        writable: true,
        configurable: true
    });
}

export function setNameOfGlobalThisProp(cls: Stringed<keyof GlobalThis>): void {
    Object.defineProperty(globalThis[cls], "name", {value: cls});
}

export function setPropName<T, K extends Stringed<keyof T>>(cls: T, prop: K): void {
    Object.defineProperty(cls[prop], "name", {value: prop});
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

export function parseTime(value: string): Date {
    const [h, m, s] = value.split(":");
    const [sec, ms] = (s ?? "0").split(".");
    const date = new Date();
    date.setHours(+(h || 0), +(m || 0), +(sec || 0), +(ms || 0));
    return date;
}

export function mixin<T extends Func>(
        fn: T,
        location: "HEAD",
        mixinFn: T
): T;
export function mixin<T extends Func, This = ThisParameterType<T>, Ret = ReturnType<T>>(
        fn: T,
        location: "TAIL",
        mixinFn: (this: This & { mixin: { value: Ret } }, ...args: Parameters<T>) => Ret
): T;
export function mixin<T extends Func, This = Func.This<T>, Ret = Func.Return<T>>(
        fn: T,
        location: "HEAD" | "TAIL",
        mixinFn: Func
): T {
    switch (location) {
        case "HEAD":
            return (function (this: This, ...args: Parameters<T>): Ret {
                mixinFn.call(this, ...args);
                return fn.call(this, ...args) as Ret;
            }) as T;

        case "TAIL":
            return (function (this: This, ...args: Parameters<T>): Ret {
                const result = fn.call(this, ...args);
                const self = Object.assign({mixin: {value: result}}, this);
                mixinFn.call(self, ...args);
                return result as Ret;
            }) as T;
    }
}