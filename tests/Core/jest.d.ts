import 'jest';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeType(type: Primitive): R
    }
  }
}