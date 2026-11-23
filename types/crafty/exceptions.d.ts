declare global {
    namespace Crafty {
        interface Error extends globalThis.Error { }
        interface ErrorConstructor extends ErrorConstructorOf<Error> { }
        interface ChildrenNotAllowedError extends Error { }
        interface ChildrenNotAllowedErrorConstructor extends ErrorConstructorOf<ChildrenNotAllowedError> { }
        interface NormalizationError extends Error { }
        interface NormalizationErrorConstructor extends ErrorConstructorOf<NormalizationError> { }
    }
}

export { };