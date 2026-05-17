declare namespace Unsync {
  type Callbacks<L extends unknown[]> = ((...args: Unboxed<L>) => void)[];

  interface EventController {
    on(): void;
    off(): void;
    get applied(): boolean;
  }

  interface SetEmitter<T extends Record<string, Class[]> = {}> {
    on<K extends keyof T, L extends Unboxed<T[K]>>(
      ev: K,
      callback: (...args: L) => void
    ): void;
    off<K extends keyof T>(ev: K): void;
    emit<K extends keyof T>(ev: K, ...args: Unboxed<T[K]>): void;
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
    new(): EventEmitter<{}>;
  }

  interface SetEmitterConstructor {
    new<T extends Record<string, Class[]>>(events: T): SetEmitter<T>;
  }
}