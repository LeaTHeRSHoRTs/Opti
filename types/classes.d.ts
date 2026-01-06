type EnumInstance<T extends readonly string[]> = {
  readonly [K in T[number]]: symbol;
} & {
  [Symbol.iterator](): IterableIterator<T[number]>
};

interface TupleConstructor {
  new <T extends unknown[]>(...values: T): T
}

interface TimeConstructor {
  new(): Time;
  new(hours: Date): Time;
  new(hours: number, minutes: number, seconds?: number, milliseconds?: number): Time;
  new(hours?: number | Date, minutes?: number, seconds?: number, milliseconds?: number): Time;

  of(date: Date): Time;
  at(hours: number, minutes: number, seconds?: number, milliseconds?: number): number;
  now(): number;

  fromDate(date: Date): Time;
  fromMilliseconds(ms: number): Time;
  fromString(timeString: string): Time;
  fromISOString(isoString: string): Time;

  equals(first: Time, other: Time): boolean;
}

interface Time {
  getHours(): number;
  getMinutes(): number;
  getSeconds(): number;
  getMilliseconds(): number;
  getTime(): number;

  setHours(hours: number): void;
  setMinutes(minutes: number): void;
  setSeconds(seconds: number): void;
  setMilliseconds(milliseconds: number): void;

  sync(): Time;

  toString(): string;
  toISOString(): string;
  toJSON(): string;
  toDate(years: number, months: number, days: number): Date;

  addMilliseconds(ms: number): Time;
  subtractMilliseconds(ms: number): Time;
  addSeconds(seconds: number): Time;
  addMinutes(minutes: number): Time;
  addHours(hours: number): Time;

  // Comparison
  compare(other: Time): number;
  isBefore(other: Time): boolean;
  isAfter(other: Time): boolean;
  equals(other: Time): boolean;
}

interface FutureConstructor extends PromiseConstructor {
  new <T, R extends Error | Exception = Error>(executor: (resolve: (value: T) => void, reject: (err?: R) => void) => void): Future<T, R>;
}

interface Future<T, R extends Error | Exception = Error> extends Promise<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Future.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: R) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Future<TResult1 | TResult2, R>;

  /**
   * Attaches a callback for only the rejection of the Future.
   */
  catch<TResult = never>(
    onrejected?: ((reason: R) => TResult | PromiseLike<TResult>) | undefined | null
  ): Future<T | TResult, R>;

  /**
   * Attaches a callback that is invoked when the Future is settled (resolved or rejected).
   */
  finally(onfinally?: (() => void) | undefined | null): Future<T, R>;
}

interface CollectionConstructor {
  from<T>(arrayLike: ArrayLike<T>): Collection<T>;

  of<T extends unknown[]>(...values: T): Collection<T[number]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  of(): Collection<any>
}

interface Collection<T> extends ArrayLike<T> {
  item(index: number): T | Missing;
  each(callbackfn: (value: T, index: number) => void, thisArg?: unknown): void;
  [Symbol.iterator](): IterableIterator<T>
  entries(): ArrayIterator<[number, T]>
  keys(): ArrayIterator<number>
  values(): ArrayIterator<T>
  toArray(): T[]
  toReadonlyArray(): readonly T[];
}

//* Exceptions
interface Exception {
  _name: string
  readonly name: string;
  getMessage(): string;
  getCause(): string;
  getStackTrace(): string;
  throw(): never;
  toString(): string;
}

interface BaseExceptionConstructor extends ExceptionConstructor<Exception> {
  isException(ctor: Class): ctor is ExceptionConstructor;
  isAnyException(ctor: Class): ctor is ExceptionConstructor | RuntimeExceptionConstructor;
}

interface ExceptionConstructor<Inst extends Exception = Exception> {
  new(message?: string, cause?: string): Inst;
  prototype: Inst;
}

// ------------------------------
// RuntimeException
// ------------------------------
interface RuntimeException {
  readonly name: "RuntimeException";
  getMessage(): string;
  getCause(): string;
  getStackTrace(): string;
  throw(): never;
  toString(): string;
}

interface RuntimeExceptionConstructor {
  new(message?: string, cause?: string): RuntimeException
}

interface DecoratorException extends Exception {}
interface DecoratorExceptionConstructor extends ExceptionConstructor<DecoratorException> {}

  interface IncorrectDecoratorPlacementException extends DecoratorException {}
  interface IncorrectDecoratorPlacementExceptionConstructor extends ExceptionConstructor<IncorrectDecoratorPlacementException> {}

  interface AbstractException extends DecoratorException {}
  interface AbstractExceptionConstructor extends ExceptionConstructor<AbstractException> {}

    interface AbstractInitializationException extends AbstractException {}
    interface AbstractInitializationExceptionConstructor extends ExceptionConstructor<AbstractInitializationException> {}
    interface AbstractMethodInvokedException extends AbstractException {}
    interface AbstractMethodInvokedExceptionConstructor extends ExceptionConstructor<AbstractMethodInvokedException> {}

// ------------------------------
// Other exceptions
// ------------------------------
interface UnknownException extends Exception {}
interface UnknownExceptionConstructor extends ExceptionConstructor<UnknownException> {}

interface DebouncedException extends Exception {}
interface DebouncedExceptionConstructor extends ExceptionConstructor<DebouncedException> {}

interface SyntaxException extends Exception {}
interface SyntaxExceptionConstructor extends ExceptionConstructor<SyntaxException> {}

interface NotImplementedException extends Exception {}
interface NotImplementedExceptionConstructor extends ExceptionConstructor<NotImplementedException> {}

interface AccessException extends Exception {}
interface AccessExceptionConstructor extends ExceptionConstructor<AccessException> {}

interface AssertionException extends Exception {}
interface AssertionExceptionConstructor extends ExceptionConstructor<AssertionException> {}

interface FetchException extends Exception {}
interface FetchExceptionConstructor extends ExceptionConstructor<FetchException> {}

interface TypeException extends Exception {}
interface TypeExceptionConstructor extends ExceptionConstructor<TypeException> {}

interface CloneException extends Exception {}
interface CloneExceptionConstructor extends ExceptionConstructor<CloneException> {}

interface NumberException extends Exception {}
interface NumberExceptionConstructor extends ExceptionConstructor<NumberException> {}

  interface NumberTooSmallException extends Exception {}
  interface NumberTooSmallExceptionConstructor extends ExceptionConstructor<NumberTooSmallException> {}


interface CollectionException extends Exception {}
interface CollectionExceptionConstructor extends ExceptionConstructor<CollectionException> {}

  interface CollectionOutOfBoundsException extends Exception {}
  interface CollectionOutOfBoundsExceptionConstructor extends ExceptionConstructor<CollectionOutOfBoundsException> {}

interface MalformedQueryException extends Exception {}
interface MalformedQueryExceptionConstructor extends ExceptionConstructor<MalformedQueryException> {}