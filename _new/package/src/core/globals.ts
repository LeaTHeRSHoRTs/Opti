export function assert(condition: boolean, reason?: string): asserts condition {
    if (!condition) {
        throw new AssertionError(reason);
    }
}

export function sleep(ms: number): Future<void> {
    if (ms <= 0) throw new RangeError("Invalid timeout value (must be greater than 0)");
    return new Future((res, _) => {
        setTimeout(res, ms);
    });
}

export function isEmpty<T>(val: T): val is Empty<T> {
    // Generic type checking
    // eslint-disable-next-line eqeqeq
    if (val == null || val === false || val === "") return true;

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