declare global {
    namespace Crafty {
        interface Error extends globalThis.Error { }
        interface ErrorConstructor extends DynErrorCtor<Error> { }
        interface ChildrenNotAllowedError extends Error { }
        interface ChildrenNotAllowedErrorConstructor extends DynErrorCtor<ChildrenNotAllowedError> { }
        interface NormalizationError extends Error { }
        interface NormalizationErrorConstructor extends DynErrorCtor<NormalizationError> { }
    }
}

export { };