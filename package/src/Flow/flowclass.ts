export class _InternalFlow {
  static #checker<T>(val: T): val is NonNullable<T> {
    return val !== null && val !== undefined;
  }

  public static flows(val: unknown): boolean {
    if (this.#checker(val)) {
      return true;
    }
    return false;
  }

  public static always<T>(val: T, flowback: NonNullable<T>): [NonNullable<T>, boolean] {
    if (this.#checker(val)) {
      return [val, false];
    }
    return [flowback, true];
  }

  public static globals = {
    always<K extends keyof GlobalThis>(val: K, flowback: NonNullable<GlobalThis[K]>): boolean {
      const checked = globalThis[val];
      if (_InternalFlow.#checker(checked)) return false;
      globalThis[val] = flowback;
      return true;
    },
    flows<K extends keyof GlobalThis>(val: K): boolean {
      return _InternalFlow.#checker(globalThis[val]);
    }
  };
}
