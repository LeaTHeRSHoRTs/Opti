export class SetEmitter<T extends Record<string, Class[]>> {
  #eventMap: { [K in keyof T]?: ((...args: Unboxed<T[K]>) => void)[] } = {};
  #restricted: T;

  constructor(obj: T) {
    this.#restricted = obj;
  }

  on<K extends keyof T>(ev: K, callback: (...args: Unboxed<T[K]>) => void): void {
    if (!this.#restricted[ev]) throw new Unsync.InvalidRegistrationException(`Cannot register event ${ev.toString()}, as it does not exist in the event map.`);
    const list = this.#eventMap[ev] ?? [];
    list.push(callback);
    this.#eventMap[ev] = list;
  }

  off<K extends keyof T>(ev: K): void {
    delete this.#eventMap[ev];
  }

  emit<K extends keyof T>(ev: K, ...args: Unboxed<T[K]>): void {
    const callbacks = this.#eventMap[ev];
    if (callbacks) {
      for (const cb of callbacks) {
        cb(...args);
      }
    }
  }
}

export class Emitter<T extends Record<string, unknown[]> = {}> {  
  protected _eventMap: { [K in keyof T]?: Unsync.Callbacks<T[K]> } = {};

  on<K extends string, L extends unknown[]>(
    ev: K,
    callback: (...args: L) => void
  ): asserts this is Unsync.EventEmitter<T & { [P in K]: K extends keyof T ? [...T[K], L] : [L] }> {
    this._eventMap[ev] = [...(this._eventMap[ev] || []), callback] as Unsync.Callbacks<unknown[]>;
  }

  off<K extends keyof T>(ev: K): asserts this is Unsync.EventEmitter<Omit<T, K>> {
    delete this._eventMap[ev];
  }

  emit<K extends keyof T>(ev: K, ...args: Unboxed<T[K]>): void {
    const callbacks = this._eventMap[ev];
    if (callbacks) {
      for (const cb of callbacks) {
        cb(...args);
      }
    }
  }
}