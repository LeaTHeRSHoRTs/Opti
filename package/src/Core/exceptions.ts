export class Exception extends Error {
  #message: string;
  #cause: string;
  #internalStack: string;

  constructor(message?: string, cause?: string) {
    super();
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);

    this.#message = message ?? "";
    this.#cause = cause ?? "";
    this.#internalStack = super.stack ?? "";
  }

  public getName(): string {
    return this.constructor.name;
  }

  public getMessage(): string {
    return this.#message;
  }

  public getCause(): string {
    return this.#cause;
  }

  public throw(): never {
    throw this;
  }

  public getStackTrace(): string {
    return this.#internalStack;
  }

  public override toString(): string {
    return `${this.constructor.name}: ${this.#message}\r\n${this.#internalStack}`;
  }

  public static isException(val: unknown): val is Exception {
    return val instanceof Exception;
  }

  public static isAnyException(val: unknown): val is Exception | RuntimeException {
    return val instanceof Exception || val instanceof RuntimeException; 
  }
}

export class RuntimeException {
  name: "RuntimeException" = "RuntimeException";
  #message: string;
  #cause: string;
  #stack: string;

  public constructor(message: string = "", cause: string = "") {
    this.#message = message;
    this.#cause = cause;
    this.#stack = new Error().stack ?? "";
  }

  public getName(): 'RuntimeException' {
    return 'RuntimeException';
  }

  public getMessage(): string {
    return this.#message;
  }

  public getCause(): string {
    return this.#cause;
  }

  public toString(): string {
    return `RuntimeException${this.#message ? ": " + this.#message : ""}`;
  }

  public getStackTrace(): string {
    return this.#stack;
  }

  public throw(): never {
    throw this;
  }
}

export class SyntaxException extends Exception {}
export class CloneException extends Exception {}
export class HierarchyException extends Exception {}
export class NumberException extends Exception {}
export class NumberTooSmallException extends Exception {}
export class TypeException extends Exception {}
export class NotImplementedException extends Exception {}
export class UnknownException extends Exception {}
export class AccessException extends Exception {}
export class AssertionException extends Exception {}
export class FetchException extends Exception {}
export class DebouncedException extends Exception {}
export class AbstractMethodInvokedException extends Exception {}
export class AbstractInitializationException extends Exception {}
export class IncorrectDecoratorPlacementException extends Exception {}
export class RegistryException extends Exception {}