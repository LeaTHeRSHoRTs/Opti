type Callbacks<L extends unknown[]> = ((...args: L) => void)[];

interface EventController {
  on?(): void;
  off?(): void;
  del?(): void;
  exists(): this is { on(): void; off(): void; del(): void };
}

interface SetEmitter<T extends Record<string, [...Class.Constructable[]]> = {}> {
  on<K extends keyof T, L extends Unboxed<T[K]>>(
    ev: K,
    callback: (...args: L) => void
  ): void;
  off<K extends keyof T>(ev: K): void;
  emit<K extends keyof T>(ev: K, ...args: T[K]): void;
}

interface EventEmitter<T extends Record<string, unknown[]> = {}> {
  on<K extends string, L extends unknown[]>(
    ev: K,
    callback: (...args: L) => void
  ): asserts this is EventEmitter<T & { [P in K]: K extends keyof T ? [...T[K], L] : [L] }>;
  on<K extends keyof T, L extends T[K]>(
    ev: K,
    callback: (...args: L) => void
  ): asserts this is EventEmitter<T & { [P in K]: K extends keyof T ? [...T[K], L] : [L] }>;
  off<K extends keyof T>(ev: K): asserts this is EventEmitter<Omit<T, K>>;
  emit<K extends keyof T>(ev: K, ...args: T[K]): void;
}

interface EmitterConstructor {
  new(): EventEmitter<{}>
}

interface SetEmitterConstructor {
  new<T extends Record<string, Class.Constructable[]>>(events: T): SetEmitter<T>;
}