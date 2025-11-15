/** @potential */
export class Time {
  private hours: number;
  private minutes: number;
  private seconds: number;
  private milliseconds: number;

  public constructor();
  public constructor(hours: Date);
  public constructor(hours: number, minutes: number, seconds?: number, milliseconds?: number);
  public constructor(hours?: number | Date, minutes?: number, seconds?: number, milliseconds?: number) {
    if (hours instanceof Date) {
      this.hours = hours.getHours();
      this.minutes = hours.getMinutes();
      this.seconds = hours.getSeconds();
      this.milliseconds = hours.getMilliseconds();
    } else {
      const now = new Date();
      this.hours = hours ?? now.getHours();
      this.minutes = minutes ?? now.getMinutes();
      this.seconds = seconds ?? now.getSeconds();
      this.milliseconds = milliseconds ?? now.getMilliseconds();
    }

    this.validateTime();
  }

  // Validation for time properties
  private validateTime(): void {
    if (this.hours < 0 || this.hours >= 24) throw new globalThis.SyntaxException("Hours must be between 0 and 23.");
    if (this.minutes < 0 || this.minutes >= 60) throw new globalThis.SyntaxException("Minutes must be between 0 and 59.");
    if (this.seconds < 0 || this.seconds >= 60) throw new globalThis.SyntaxException("Seconds must be between 0 and 59.");
    if (this.milliseconds < 0 || this.milliseconds >= 1000) throw new globalThis.SyntaxException("Milliseconds must be between 0 and 999.");
  }

  public static of(date: Date) {
    return new this(date);
  }

  // Getters
  public getHours(): number { return this.hours; }
  public getMinutes(): number { return this.minutes; }
  public getSeconds(): number { return this.seconds; }
  public getMilliseconds(): number { return this.milliseconds; }

  // Setters
  public setHours(hours: number): void {
    this.hours = hours;
    this.validateTime();
  }
  public setMinutes(minutes: number): void {
    this.minutes = minutes;
    this.validateTime();
  }
  public setSeconds(seconds: number): void {
    this.seconds = seconds;
    this.validateTime();
  }
  public setMilliseconds(milliseconds: number): void {
    this.milliseconds = milliseconds;
    this.validateTime();
  }

  // Returns the time in milliseconds since the start of the day
  public getTime(): number {
    return (
      this.hours * 3600000 +
      this.minutes * 60000 +
      this.seconds * 1000 +
      this.milliseconds
    );
  }

  // Returns the time in milliseconds since the start of the day
  public static at(hours: number, minutes: number, seconds?: number, milliseconds?: number): number {
    return new Time(hours, minutes, seconds, milliseconds).getTime();
  }

  public sync() {
    return new Time();
  }

  // Static: Return current time as a Time object
  public static now(): number {
    return new Time().getTime();
  }

  public toString() {
    return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;;
  }

  public toISOString(): string {
    return `T${this.toString()}.${this.milliseconds.toString().padStart(3, '0')}Z`;
  }

  public toJSON(): string {
    return this.toISOString(); // Leverage the existing toISOString() method
  }

  public toDate(years: number, months: number, days: number): Date {
    return new Date(years, months, days, this.hours, this.minutes, this.seconds, this.milliseconds);
  }

  public static fromDate(date: Date) {
    return new Time(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  }

  // Arithmetic operations
  public addMilliseconds(ms: number): Time {
    const totalMilliseconds = this.getTime() + ms;
    return Time.fromMilliseconds(totalMilliseconds);
  }

  public subtractMilliseconds(ms: number): Time {
    const totalMilliseconds = this.getTime() - ms;
    return Time.fromMilliseconds(totalMilliseconds);
  }

  public addSeconds(seconds: number): Time {
    return this.addMilliseconds(seconds * 1000);
  }

  public addMinutes(minutes: number): Time {
    return this.addMilliseconds(minutes * 60000);
  }

  public addHours(hours: number): Time {
    return this.addMilliseconds(hours * 3600000);
  }

  // Static: Create a Time object from total milliseconds
  public static fromMilliseconds(ms: number): Time {
    const hours = Math.floor(ms / 3600000) % 24;
    const minutes = Math.floor(ms / 60000) % 60;
    const seconds = Math.floor(ms / 1000) % 60;
    const milliseconds = ms % 1000;
    return new Time(hours, minutes, seconds, milliseconds);
  }

  // Parsing
  public static fromString(timeString: string): Time {
    const match = timeString.match(/^(\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{3}))?$/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3] ?? "0", 10);
      const milliseconds = parseInt(match[4] ?? "0", 10);
      return new Time(hours, minutes, seconds, milliseconds);
    }
    throw new globalThis.SyntaxException("Invalid time string format.");
  }

  public static fromISOString(isoString: string): Time {
    const match = isoString.match(/T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3], 10);
      const milliseconds = parseInt(match[4], 10);
      return new Time(hours, minutes, seconds, milliseconds);
    }
    throw new globalThis.SyntaxException("Invalid ISO string format.");
  }

  // Comparison
  public compare(other: Time): number {
    const currentTime = this.getTime();
    const otherTime = other.getTime();

    if (currentTime < otherTime) {
      return -1;
    } else if (currentTime > otherTime) {
      return 1;
    } else {
      return 0;
    }
  }

  public isBefore(other: Time): boolean {
    return this.compare(other) === -1;
  }

  public isAfter(other: Time): boolean {
    return this.compare(other) === 1;
  }

  public equals(other: Time): boolean {
    return this.compare(other) === 0;
  }

  public static equals(first: Time, other: Time): boolean {
    return first.compare(other) === 0;
  }
}

export function Tuple<T extends unknown[]>(...values: T) {
  return values;
}

export function Enum<T extends readonly string[]>(...values: T) {
  const obj = {} as { [K in T[number]]: symbol };

  values.forEach((val) => {
    const key = String(val);

    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) {
      throw new globalThis.SyntaxException("Enum values must be defined and may only be the characters A-Z, a-z, 0-9, _ and $");
    } else if (Object.prototype.hasOwnProperty.call(obj, key)) {
      throw new globalThis.SyntaxException("Enum members may only be unique");
    }

    Object.defineProperty(obj, key, {
      value: Symbol(key),
      enumerable: true,
      configurable: false,
      writable: false,
    });
  });

  // Add iterator
  Object.defineProperty(obj, Symbol.iterator, {
    enumerable: false,
    value: function* (): IterableIterator<T[number]> {
      for (const val of values) {
        yield val;
      }
    },
  });

  return obj;
}

export class Collection<T> implements ArrayLike<T> {
  private items: T[];
  readonly [key: number]: T;

  private constructor(items?: T[]) {
    this.items = items ?? [];
  }

  get length(): number {
    return this.items.length;
  }

  public static from<T>(arrayLike: ArrayLike<T>) {
    return new Collection<T>(Array.from(arrayLike));
  }

  public static of<T extends unknown[]>(...values: T) {
    return new Collection<T[number]>(values);
  }

  item(index: number): T | null {
    return this.items[index] ?? null;
  }

  each(callback: (value: T, key: number) => void, thisArg?: any) {
    this.items.forEach(callback, thisArg);
  }

  *[Symbol.iterator]() {
    yield* this.items;
  }

  *entries() {
    yield* this.items.entries();
  }

  *keys() {
    yield* this.items.keys();
  }

  *values() {
    yield* this.items.values();
  }
}