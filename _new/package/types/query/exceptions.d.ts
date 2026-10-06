declare namespace Query {
    interface Error extends globalThis.Error {}
    interface ErrorConstructor extends globalThis.DynErrorCtor<Error> {}
    interface MalformedQueryError extends Error {}
    interface MalformedQueryErrorConstructor extends globalThis.DynErrorCtor<MalformedQueryError> {}

    interface UnsupportedSelectorError extends Error {}
    interface UnsupportedSelectorErrorConstructor extends globalThis.DynErrorCtor<UnsupportedSelectorError> {}
}