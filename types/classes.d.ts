type EnumInstance<T> = {
  readonly [K in T[number]]: symbol;
};

interface TupleConstructor {
  new<T extends unknown[]>(...values: T): T
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

interface CollectionConstructor {
  new<T>(collection: T[]): Collection<T>
  from<T>(arrayLike: ArrayLike<T>): Collection<T>
}

interface Collection<T> {
  readonly length: number;

  [index: number]: T;
  item(inedx: number): T | null;
  each(callbackfn: (value: T, key: number) => void, thisArg?: any): void;

  [Symbol.iterator](): IterableIterator<T>

  entries(): IterableIterator<[number, T]>
  keys(): IterableIterator<number>
  values(): IterableIterator<T>
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
  new(name: string | null, message?: string, cause?: string): Exception
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