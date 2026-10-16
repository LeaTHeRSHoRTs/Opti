import { isNum } from '../helpers';

export function is<T>(value: T): Is<T> {
    function createChain(evaluate: Func.Supplier<boolean>): Is<T> {
        const run = (() => evaluate()) as unknown as Is<T>;

        run.get = () => value;
        run.equal = (other: unknown) => {
            if (!evaluate()) return false;
            return value === other;
        },
        run.empty = () => { return isEmpty(value); },
        run.same = <U>(other: U): Is <U> => { return (value as _) === other; },
        run.type = <U extends Primitive>(type: U): Is < TypeOf < U >> => { return typeof value === type; },
        run.bigger = (size: Sized | number) => {
            if (value === null) {
                return false;
            }
            if (typeof value === 'object') {
                const obj = value as Record<string, unknown>;
                const target = size as Record<string, unknown>;

                if (("size" in obj || "length" in obj) && ("size" in target || "length" in target)) {
                    const originSize = obj.size ?? obj.length;
                    const sizeSize = target.size ?? target.length;

                    // 3. Return your comparison (e.g., check if origin is bigger, smaller, or equal)
                    if (isNum(originSize) && isNum(sizeSize)) {
                        return originSize > sizeSize;
                    }
                }
            }
            return false;
        },
        run.smaller = (size: Sized | number) => {
            if (value === null) {
                return false;
            }
            if (typeof value === 'object') {
                const obj = value as Record<string, unknown>;
                const target = size as Record<string, unknown>;

                if (("size" in obj || "length" in obj) && ("size" in target || "length" in target)) {
                    const originSize = obj.size ?? obj.length;
                    const sizeSize = target.size ?? target.length;

                    // 3. Return your comparison (e.g., check if origin is bigger, smaller, or equal)
                    if (isNum(originSize) && isNum(sizeSize)) {
                        return originSize < sizeSize;
                    }
                }
            }
            return false;
        },
        run.after = (time: Date | number | 'now') => {
            if (!(value instanceof Date)) {
                return false;
            }
            if (time instanceof Date) {
                return time.getTime() > value.getTime();
            } else if (typeof time === 'number') {
                return time > value.getTime();
            } else {
                return Date.now() > value.getTime();
            }
        },
        run.before = (time: Date | number | 'now') => {
            if (!(value instanceof Date)) {
                return false;
            }
            if (time instanceof Date) {
                return time.getTime() < value.getTime();
            } else if (typeof time === 'number') {
                return time < value.getTime();
            } else {
                return Date.now() < value.getTime();
            }
        },
        run.length = (size: Sized | number) => {
            if (value === null) {
                return false;
            }
            if (typeof value === 'object') {
                const obj = value as Record<string, unknown>;
                const target = size as Record<string, unknown>;

                if (("size" in obj || "length" in obj) && ("size" in target || "length" in target)) {
                    const originSize = obj.size ?? obj.length;
                    const sizeSize = target.size ?? target.length;

                    // 3. Return your comparison (e.g., check if origin is bigger, smaller, or equal)
                    if (isNum(originSize) && isNum(sizeSize)) {
                        return originSize === sizeSize;
                    }
                }
            }
            return false;
        };

        return run;
    }
}

if (is("string")
    .bigger(5)
    .equal("other")
) { }
if (is(5).type('string')) { }
if (is(new Date()).before('now')) { }
if (is([1, 2, 3]).length(3)) { }

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