declare namespace Unsync {
    /**
     *
     */
    type Callbacks<L extends unknown[]> = ((...args: Unboxed<L>) => void)[];

    interface EventController {
        /**
         *
         * @example
         */
        on(): void;
        /**
         *
         * @example
         */
        off(): void;
        /**
         *
         * @example
         */
        get applied(): boolean;
    }

    interface SetEmitter<T extends Record<string, Class[]> = {}> {
        /**
         *
         * @param ev
         * @param callback
         * @example
         */
        on<K extends keyof T>(
            ev: K,
            callback: (...args: Unboxed<T[K]>) => void
        ): void;
        /**
         *
         * @param ev
         * @example
         */
        off<K extends keyof T>(ev: K): void;
        /**
         *
         * @param ev
         * @param {...any} args
         * @example
         */
        emit<K extends keyof T>(ev: K, ...args: Unboxed<T[K]>): void;
    }

    interface EventEmitter<T extends Record<string, unknown[]> = {}> {
        /**
         *
         * @param ev
         * @param callback
         * @example
         */
        on<K extends string, L extends unknown[]>(
            ev: K,
            callback: (...args: L) => void
        ): asserts this is EventEmitter<T & { [P in K]: K extends keyof T ? [...T[K], L] : [L] }>;
        /**
         *
         * @param ev
         * @param callback
         * @example
         */
        on<K extends keyof T, L extends T[K]>(
            ev: K,
            callback: (...args: L) => void
        ): asserts this is EventEmitter<T & { [P in K]: K extends keyof T ? [...T[K], L] : [L] }>;
        /**
         *
         * @param ev
         * @example
         */
        off<K extends keyof T>(ev: K): asserts this is EventEmitter<Omit<T, K>>;
        /**
         *
         * @param ev
         * @param {...any} args
         * @example
         */
        emit<K extends keyof T>(ev: K, ...args: T[K]): void;
    }

    interface EmitterConstructor {
        new(): EventEmitter<{}>;
    }

    interface SetEmitterConstructor {
        new<T extends Record<string, Class[]>>(events: T): SetEmitter<T>;
    }
}