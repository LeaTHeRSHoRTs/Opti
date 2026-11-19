export function assert(condition: boolean, reason?: string): asserts condition {
    if (!condition) throw new AssertionError(reason);
}

export function sleep(ms: number): Future<void> {
    if (ms <= 0) throw new RangeError("Invalid timeout value (must be greater than 0)");
    return new Future((res, _) => setTimeout(res, ms));
}

export function isEmpty(val: string): val is '';
export function isEmpty(val: number): val is typeof NaN;
export function isEmpty(val: boolean): val is false;
export function isEmpty(val: null | undefined): true;
export function isEmpty(val: unknown[]): val is [];
export function isEmpty(val: Record<Key, unknown>): val is Record<Key, never>;
export function isEmpty(val: Map<unknown, unknown>): val is Map<unknown, never>;
export function isEmpty(val: Set<unknown>): val is Set<never>;
export function isEmpty(val: WeakMap<object, unknown>): val is WeakMap<object, unknown>;
export function isEmpty(val: WeakSet<object>): val is WeakSet<object>;
export function isEmpty(val: unknown): boolean;
export function isEmpty(val: unknown): boolean {
    // Generic type checking
    if (val === null || val === undefined || val === false || val === "") return true;

    // Number checking
    if (typeof val === 'number') return val === 0 || Number.isNaN(val);

    // Array checking
    if (Array.isArray(val) && val.length === 0) return true;

    if (val instanceof Map || val instanceof Set) {
        return val.size === 0; // size check works for these types
    }

    // Object checking
    if (typeof val === 'object') {
        const proto = Object.getPrototypeOf(val);
        const isPlain = proto === Object.prototype || proto === null;
        return isPlain && Object.keys(val).length === 0;
    }

    return false;
}