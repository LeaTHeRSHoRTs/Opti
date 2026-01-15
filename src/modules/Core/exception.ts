export class Exception extends Error implements Exception {
  protected _name: string = "Exception";
  private _message: string;
  private _cause: string;
  private _internalStack: string;

  constructor(message?: string, cause?: string) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
    this._message = message ?? "";
    this._cause = cause ?? "";

    this._internalStack = new Error().stack ?? "";
  }

  public get name(): string {
    return this._name;
  }

  public getMessage(): string {
    return this._message;
  }

  public getCause(): string {
    return this._cause;
  }

  public throw(): never {
    throw this;
  }

  public getStackTrace(): string {
    return this._internalStack;
  }

  public override toString(): string {
    return `${this._name}: ${this._message}\r\n${this._internalStack}`;
  }

  public static isException(ctor: Class): ctor is ExceptionConstructor {
    return ctor instanceof Exception;
  }

  public static isAnyException(ctor: Class): ctor is ExceptionConstructor | RuntimeExceptionConstructor {
    return ctor instanceof Exception || ctor instanceof RuntimeException; 
  }
}

export class RuntimeException {
  private _message: string;
  private _cause: string;
  private _stack: string;

  public constructor(message: string = "", cause: string = "") {
    this._message = message;
    this._cause = cause;
    this._stack = new Error().stack ?? "";
  }

  public get name(): "RuntimeException" {
    return "RuntimeException";
  }

  public getMessage(): string {
    return this._message;
  }

  public getCause(): string {
    return this._cause;
  }

  public toString(): string {
    return `RuntimeException: ${this._message}`;
  }

  public getStackTrace(): string {
    return this._stack;
  }

  public throw(): never {
    throw this;
  }
}

function makeException<T extends ExceptionConstructor>(name: string): T {
  return class extends Exception {
    _name = name;
  } as unknown as T;
}

export const SyntaxException = makeException<SyntaxExceptionConstructor>("SyntaxException");
export const CloneException = makeException<CloneExceptionConstructor>("CloneException");
export const NumberTooSmallException = makeException<NumberTooSmallExceptionConstructor>("NumberTooSmallException");
export const TypeException = makeException<TypeExceptionConstructor>("TypeException");
export const NotImplementedException = makeException<NotImplementedExceptionConstructor>("NotImplementedException");
export const UnknownException = makeException<UnknownExceptionConstructor>("UnknownException");
export const AccessException = makeException<AccessExceptionConstructor>("AccessException");
export const AssertionException = makeException<AssertionExceptionConstructor>("AssertionException");
/** @future */
export const FetchException = makeException<FetchExceptionConstructor>("FetchException");
export const DebouncedException = makeException<DebouncedExceptionConstructor>("DebouncedException");
export const AbstractMethodInvokedException = makeException<AbstractMethodInvokedExceptionConstructor>("AbstractMethodInvokedException");
export const AbstractInitializationException = makeException<AbstractInitializationExceptionConstructor>("AbstractInitializationException");
export const CollectionOutOfBoundsException = makeException<CollectionOutOfBoundsExceptionConstructor>("CollectionOutOfBoundsException");
export const MalformedQueryException = makeException<MalformedQueryExceptionConstructor>("MalformedQueryException");
export const IncorrectDecoratorPlacementException = makeException<IncorrectDecoratorPlacementExceptionConstructor>("IncorrectDecoratorPlacementException");