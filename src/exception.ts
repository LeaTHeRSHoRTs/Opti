export class Exception extends Error {
  private _name: string;
  private _message: string;
  private _cause: string;
  private _internalStack: string;

  constructor(name: string | null, message: string = "", cause: string = "") {
    super();
    this._message = message;
    this._cause = cause;
    this._name = name ?? "Exception";
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
}

export class RuntimeException {
  private _message: string;
  private _cause: string;

  public constructor(message: string = "", cause: string = "") {
    this._message = message;
    this._cause = cause;
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
}

function makeException(name: string): SubExceptionConstructor {
  return class extends Exception {
    constructor(message?: string, cause?: string) {
      super(name, message, cause);
    }
  };
}

export const SyntaxException = makeException("SyntaxException");
export const CloneException = makeException("CloneException");
export const NumberTooSmallException = makeException("NumberTooSmallException");
export const TypeException = makeException("TypeException");
export const NotImplementedException = makeException("NotImplementedException");
export const UnknownException = makeException("UnknownException");
export const AccessException = makeException("AccessException");
export const AssertionException = makeException("AssertionException");
/** @future */
export const FetchException = makeException("FetchException");
export const DebouncedException = makeException("DebouncedException");