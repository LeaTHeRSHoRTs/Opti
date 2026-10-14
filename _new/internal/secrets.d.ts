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