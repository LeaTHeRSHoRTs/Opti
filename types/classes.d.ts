type EnumInstance<T> = {
  readonly [K in T[number]]: symbol;
} & {
  [Symbol.iterator](): IterableIterator<T[number]>
};

interface TupleConstructor {
  new <T extends unknown[]>(...values: T): T
}

interface TimeConstructor {
  new();
  new(hours: Date);
  new(hours: number, minutes: number, seconds?: number, milliseconds?: number);
  new(hours?: number | Date, minutes?: number, seconds?: number, milliseconds?: number);

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

interface TypedMap<R extends Record<string | number, any> = {}> {
  readonly size: number;

  set<K extends string, F>(
    key: K,
    value: F
  ): asserts this is TypedMap<R & { [P in K]: F }>;

  get<K extends keyof R>(key: K): R[K];

  notNull<K extends keyof R>(key: K): boolean;

  delete<K extends keyof R>(key: K): asserts this is TypedMap<Omit<R, K>>;

  keys(): (keyof R)[];

  entries(): [keyof R, R[keyof R]][];

  clear(): void;

  [Symbol.iterator](): IterableIterator<[keyof R, R[keyof R]]>;

  readonly [Symbol.toStringTag]: string;

  forEach(callback: <K extends keyof R>(value: R[K], key: K) => void): void;
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
};

interface CollectionConstructor {
  from<T>(arrayLike: ArrayLike<T>): Collection<T>;

  of<T extends unknown[]>(...values: T): Collection<T[number]>;
  of(): Collection<any>
}

interface Collection<T> extends ArrayLike<T> {
  item(inedx: number): T | null;
  each(callbackfn: (value: T, index: number) => void, thisArg?: any): void;
  [Symbol.iterator](): IterableIterator<T>
  entries(): IterableIterator<[number, T]>
  keys(): IterableIterator<number>
  values(): IterableIterator<T>
  toArray(): T[]
  toReadonlyArray(): readonly T[];
}

// Exceptions

interface Exception {
  get name(): string;
  getMessage(): string;
  getCause(): string;
  getStackTrace(): string;
  throw(): never;
  toString(): string;
}

interface ExceptionConstructor {
  prototype: Exception;
  new(message?: string, cause?: string): Exception
}

interface RuntimeExceptionConstructor {
  new(message?: string, cause?: string): RuntimeException
}

interface RuntimeException {
  get name(): "RuntimeException";
  getMessage(): string;
  getCause(): string;
  toString(): string;
}

interface SubExceptionConstructor {
  new(message?: string, cause?: string): Exception;
  readonly prototype: Exception;
}

interface UnknownExceptionConstructor {
  new(message?: string): Exception;
  readonly prototype: Exception;
}

interface DebouncedException extends Exception {}
interface DebouncedExceptionConstructor extends SubExceptionConstructor {
  new(message?: string, cause?: string): DebouncedException;
}

interface SyntaxException extends Exception {}
interface SyntaxExceptionConstructor extends SubExceptionConstructor {
  new(message?: string, cause?: string): SyntaxException;
}

interface TypeException extends Exception {}
interface TypeExceptionConstructor extends SubExceptionConstructor {
  new(message?: string, cause?: string): TypeException;
}

interface CloneException extends Exception {}
interface CloneExceptionConstructor extends SubExceptionConstructor {
  new(message?: string, cause?: string): CloneException;
}

interface NumberTooSmallException extends Exception {}
interface NumberTooSmallExceptionConstructor extends SubExceptionConstructor {
  new(message?: string, cause?: string): NumberTooSmallException;
}

interface AbstractInitializationException extends Exception {}
interface AbstractInitializationExceptionConstructor extends SubExceptionConstructor {
  new(message?: string, cause?: string): AbstractInitializationException;
}

interface AbstractMethodInvokedException extends Exception {}
interface AbstractMethodInvokedExceptionConstructor extends SubExceptionConstructor {
  new(message?: string, cause?: string): AbstractMethodInvokedException;
}

interface SortException extends Exception {}
interface SortExceptionConstructor extends SubExceptionConstructor {
  new(message?: string, cause?: string): SortException;
}

interface CollectionOutOfBoundsException extends Exception {};

interface CollectionOutOfBoundsExceptionConstructor extends SubExceptionConstructor {
  new(message?: string, cause?: string): CollectionOutOfBoundsException;
}

interface MalformedQueryException extends Exception {};

interface MalformedQueryExceptionConstructor extends SubExceptionConstructor {
  new(message?: string, cause?: string): MalformedQueryException;
}