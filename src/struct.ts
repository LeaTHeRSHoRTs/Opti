type _Prim = { type: Primitive };

class Struct<T> {
    private constructor(
        private readonly type: string,
        private readonly validator: (value: unknown) => value is T
    ) {}

    public validate(value: unknown): value is T {
        return this.validator(value);
    }

    public toString(): string {
        return this.type;
    }

    public static of<T>(obj: Struct.Object): Struct<T> {
        // ...
    }

    public static array<T>(...array: Struct<T>[]): Struct<T[]> {
        // ...
    }

    public static tuple<T extends readonly Struct<unknown>[]>(...tuple: T): T {
        // ...
    }
}