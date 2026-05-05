declare namespace Query {
  interface Exception extends globalThis.Exception {}
  interface ExceptionConstructor extends globalThis.ExceptionConstructor<Exception> {}
    interface MalformedQueryException extends Exception {}
    interface MalformedQueryExceptionConstructor extends globalThis.ExceptionConstructor<MalformedQueryException> {}

    interface UnsupportedSelectorException extends Exception {}
    interface UnsupportedSelectorExceptionConstructor extends globalThis.ExceptionConstructor<UnsupportedSelectorException> {}
}