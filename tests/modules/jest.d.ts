declare namespace jest {
  interface Matchers<R> {
    toThrowException(
      exception: ExceptionConstructor, 
      message?: string, 
      stack?: string
    ): R
  }
}