declare namespace Crafty {
  interface Exception extends globalThis.Exception {}
  interface ExceptionConstructor extends globalThis.ExceptionConstructor<Exception> {}
    interface ChildrenNotAllowedException extends Exception {}
    interface ChildrenNotAllowedExceptionConstructor extends globalThis.ExceptionConstructor<ChildrenNotAllowedException> {}
    interface NormalizationException extends Exception {}
    interface NormalizationExceptionConstructor extends globalThis.ExceptionConstructor<NormalizationException> {}
}