//* Function
export function throttle<T, A extends unknown[], R>(func: Func<T, A, R>, ms: number): Func<T, A, R | null> {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let storedArgs: A | null = null;
    let context: T | null = null;

    return function (this: T, ...rest: A): R | null {
        if (timer) {
            storedArgs = rest;
            context = this;
            return null;
        }

        // Leading execution
        const result = func.apply(this, rest);
    
        const startTimer = () => {
            timer = setTimeout(() => {
                if (storedArgs) {
                    func.apply(context as T, storedArgs);
                    storedArgs = null;
                    context = null;
                    startTimer(); // Restart to handle the next window
                } else {
                    timer = null;
                }
            }, ms);
        };

        startTimer();
        return result;
    };
}

export function debounce<T, A extends unknown[], R>(func: Func<T, A, R>, ms: number): Func<T, A, Future<R, DebouncedError>> {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let currentReject: ((err: DebouncedError) => void) | null = null;

    return function (this: T, ...rest: A): Future<R, DebouncedError> {
    // Immediately cancel previous pending call
        if (currentReject) {
            currentReject(new DebouncedError("Function was called again before this one could resolve"));
            if (timer) {
                clearTimeout(timer);
            }
        }

        const self = this;
        return new Future<R, DebouncedError>((resolve, reject) => {
            currentReject = reject;
            timer = setTimeout(() => {
                currentReject = null;
                timer = null;
                resolve(func.apply(self, rest));
            }, ms);
        });
    };
}

export function memo<T extends Func>(func: T): T {
    // Always check the registry first for persistent state
    let cache = InternalRegistries.MEMO.get(func) as Map<string, Func.Return<T>>;

    if (!cache) {
        cache = new Map<string, Func.Return<T>>();
        InternalRegistries.MEMO.set(func, cache);
    }

    return function (this: Func.This<T>, ...rest: Func.Arguments<T>): Func.Return<T> {
        const cacheKey = JSON.stringify(rest);
        const cachedResult = cache.get(cacheKey);
        if (cachedResult !== undefined) {
            return cachedResult;
        }

        // 2. Compute and store directly under the string key
        const result = func.apply(this, rest);
        cache.set(cacheKey, result);
        return result;
    } as T;
}

//* Date
export function atDate(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number {
    return new Date(year, monthIndex, date, hours, minutes, seconds, ms).getTime();
}

//* Object
export function clone<T>(object: symbol, deep?: boolean): never;
export function clone<T>(object: T, deep?: boolean): T;
export function clone<T>(object: T, deep: boolean = true): T {
    if (typeof object === 'symbol') {
        throw new CloneError("Symbols cannot be cloned");
    }

    if (!deep) {
        if (Array.isArray(object)) {
            return [...object] as T;
        }
        return { ...object };
    }

    if (
        object === null ||
    object === undefined ||
    typeof object !== 'object'
    ) {
        return object;
    }

    if (object instanceof Date) {
        return new Date(object.getTime()) as T;
    }

    // Handle Arrays
    if (Array.isArray(object)) {
        return object.map(item => clone(item, true)) as T;
    }

    // Handle Maps
    if (object instanceof Map) {
        return new Map([...object].map(([k, v]) => [k, clone(v, true)])) as T;
    }

    // Handle Sets
    if (object instanceof Set) {
        return new Set([...object].map(item => clone(item, true))) as T;
    }

    // Handle plain objects
    const proto = Object.getPrototypeOf(object);
    const result = Object.create(proto);

    for (const key of Reflect.ownKeys(object)) {
        //@ts-expect-error
        const value = object[key];
        result[key] = deep ? clone(value, true) : value;
    }

    return result;
};

export function forEach<T>(object: T, iterator: (key: keyof T, value: T[keyof T]) => unknown): void {
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            iterator(key, object[key]);
        }
    }
};

//* Number
export function repeat(this: number, iterator: (i: number) => void): void {
    for (let i = 0; i < this; i++) {
        iterator(i);
    }
};

//* Strings
export function remove(this: string, finder: string | RegExp): string {
    return this.replace(finder, "");
};

export function capitalize(this: string): string {
    const m = this.match(/^(\s*)([a-z])/);
    if (
        !m || 
    m[0] === undefined || 
    m[1] === undefined || 
    m[2] === undefined
    ) {
        return this;
    }

    return m[1] + m[2].toUpperCase() + this.slice(m[0].length);
};

export function matches(this: String, regexp: string | RegExp): boolean {
    return this.search(regexp) !== -1;
};

export function toCase(this: string, format: Str.Case): string {
    const regex = /([\s_-]+)(\S)/g;
    const charRegex = /[\s]+/g;

    switch (format) {
        case "kebab": return this.replace(charRegex, '-');
        case "snake": return this.replace(charRegex, '_');
        case "dot": return this.replace(charRegex, '.');
        case "camel": return this.replace(regex, (_, _s, next) => next.toUpperCase());
        case "pascal": return this.replace(regex, (_, _s, next) => next.toUpperCase()).replace(/^\s*(\S)/, (_, first) => first.toUpperCase());
        case "train": return this.replace(regex, (_, _s, next) => next.toUpperCase()).replace(/^\s*(\S)/, (_, first) => first.toUpperCase());
    }
}

//* Math
export function randomRange(minOrMax: number, max?: number): number {
    const min = max === undefined ? Math.min(0, minOrMax) : Math.min(minOrMax, max);
    const upper = max === undefined ? Math.max(0, minOrMax) : Math.max(minOrMax, max);

    return Math.random() * (upper - min) + min;
};

export function randomIntRange(minOrMax: number, max?: number): number {
    if (!Number.isInteger(minOrMax) || (max !== undefined && !Number.isInteger(max))) {
        throw new FloatingNumberError("Cannot set the limit to a floating point number. Limits must be whole numbers (integers) on the function randomIntRange");
    }

    const min = max === undefined ? Math.min(0, minOrMax) : Math.min(minOrMax, max);
    const upper = max === undefined ? Math.max(0, minOrMax) : Math.max(minOrMax, max);

    return Math.floor(Math.random() * (upper - min + 1)) + min;
};
