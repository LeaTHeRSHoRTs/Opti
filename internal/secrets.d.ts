// oxlint-disable esdoc/require-jsdoc esdoc/require-tags
///<reference types="../types/index.d.ts" />

/** @internal */
interface InternalRegistryManifest {
    readonly MEMO: WeakMap<Func, Map<string, unknown>>;
}

/** @internal */
declare var InternalRegistries: InternalRegistryManifest;