declare global {
    interface Struct<T> {
        readonly type: Primitive;
        validate(value: unknown): value is T;
    }

    namespace Struct {
        type String =   Struct<string>;
        type Number =   Struct<number>;
        type Boolean =  Struct<boolean>;
        type BigInt =   Struct<bigint>;
        type Object =   Struct<object>;
        type Array<T> = Struct<T[]>;
    }
}

export {};