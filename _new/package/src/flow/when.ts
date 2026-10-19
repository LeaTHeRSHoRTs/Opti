export function is<T>(value: T): When<T> {
    let success = true;

    const setSuccess = (v: boolean) => success = success && v;

    const run: When<T> & WhenForDate<Date> & WhenForNumber<number> & WhenForSized<Sized> = {
        get ok(): boolean {
            return success;
        },

        get(): T {
            return value;
        },

        equal(other: unknown) {
            setSuccess(value === other);
            return run;
        },

        same<U>(other: U) {
            setSuccess(isSame(value, other));
            return run;
        },

        empty() {
            setSuccess(isEmpty(value));
            return run;
        },

        type<U extends Primitive>(type: U) {
            setSuccess(typeof value === type);
            return run;
        },
        
        bigger(size: Sized | number) {
            if (value === null) {
                setSuccess(false);
            } else if (typeof value === 'object') {
                const obj = value as Record<string, unknown>;
                const target = size as Record<string, unknown>;

                if (("size" in obj || "length" in obj) && ("size" in target || "length" in target)) {
                    const originSize = obj.size ?? obj.length;
                    const sizeSize = target.size ?? target.length;

                    // 3. Return your comparison (e.g., check if origin is bigger, smaller, or equal)
                    if (isNum(originSize) && isNum(sizeSize)) {
                        setSuccess(originSize > sizeSize);
                    }
                }
            } else {
                setSuccess(false);
            }
            return run;
        },

        smaller(size: Sized | number) {
            if (value === null) {
                setSuccess(false);
            } else if (typeof value === 'object') {
                const obj = value as Record<string, unknown>;
                const target = size as Record<string, unknown>;

                if (("size" in obj || "length" in obj) && ("size" in target || "length" in target)) {
                    const originSize = obj.size ?? obj.length;
                    const sizeSize = target.size ?? target.length;

                    // 3. Return your comparison (e.g., check if origin is bigger, smaller, or equal)
                    if (isNum(originSize) && isNum(sizeSize)) {
                        setSuccess(originSize < sizeSize);
                    }
                }
            } else {
                setSuccess(false);
            }
            return run;
        },

        after(time: Date | number | 'now') {
            if (!(value instanceof Date)) {
                setSuccess(false);
            } else if (time instanceof Date) {
                setSuccess(time.getTime() > value.getTime());
            } else if (typeof time === 'number') {
                setSuccess(time > value.getTime());
            } else {
                setSuccess(Date.now() > value.getTime());
            }
            return run;
        },

        before(time: Date | number | 'now') {
            if (!(value instanceof Date)) {
                setSuccess(false);
            } else if (time instanceof Date) {
                setSuccess(time.getTime() < value.getTime());
            } else if (typeof time === 'number') {
                setSuccess(time < value.getTime());
            } else {
                setSuccess(Date.now() < value.getTime());
            }
            return run;
        },

        length(size: Sized | number) {
            if (value === null) {
                setSuccess(false);
            } else if (typeof value === 'object') {
                const obj = value as Record<string, unknown>;
                const target = size as Record<string, unknown>;

                if (("size" in obj || "length" in obj) && ("size" in target || "length" in target)) {
                    const originSize = obj.size ?? obj.length;
                    const sizeSize = target.size ?? target.length;

                    // 3. Return your comparison (e.g., check if origin is bigger, smaller, or equal)
                    if (isNum(originSize) && isNum(sizeSize)) {
                        setSuccess(originSize === sizeSize);
                    }
                }
            } else {
                setSuccess(false);
            }
            return run;
        }
    };

    return run;
}