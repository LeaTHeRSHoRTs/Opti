type EventListenerInfo<T, K extends keyof EventMapOf<T> = keyof EventMapOf<T>> =
  | {
      type: K, 
      func: EventFunc<T, K>,
      options: AddEventListenerOptions,
      listener: "default" | "controller",
      special?: undefined
    }
  | {
      type: K, 
      func: EventFunc<T, K>,
      options: AddEventListenerOptions,
      listener: "conditional",
      special: ((this: T, e: EventMapOf<T>[K]) => boolean) | number
    };


/* */
interface EventTarget {
    /** @internal */
    _events: Record<string, EventListenerInfo<EventTarget, any>[]>;
}

/** @internal */
interface InternalRegistryManifest {
    readonly MEMO: WeakMap<Func, Map<string, any>>;
}

/** @internal */
declare var InternalRegistries: InternalRegistryManifest;