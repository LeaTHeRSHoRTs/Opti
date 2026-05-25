/* eslint-disable @typescript-eslint/no-explicit-any */
interface EventTarget {
  /** @internal */
  _events: Record<string, EventListenerInfo<EventTarget, any>[]>;
}

/** @internal */
interface InternalRegistryManifest {
  readonly MEMO: WeakMap<Func, Map<any, any>>;
  readonly THROTTLE: WeakMap<Func, Func>;
  readonly DEBOUNCE: WeakMap<Func, Func>;
}

/** @internal */
declare var InternalRegistries: InternalRegistryManifest;