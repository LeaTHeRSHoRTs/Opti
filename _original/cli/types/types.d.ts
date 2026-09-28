interface OptionalArg<T extends string[] | [true] = string[] | [true]> {
  readonly optional: true;
  readonly default?: T extends [true] ? string : T[number];
  readonly placeholder: string;
  readonly desc: string;
  readonly values: T;
}

interface RequiredArg<T extends string[] | [true] = string[] | [true]> {
  readonly optional: false;
  readonly placeholder: string;
  readonly desc: string;
  readonly values: T;
}

interface Flag {
  readonly name: string;
  readonly desc: string;
  readonly alias?: string;
}

type WideArgs<T extends string[] | [true] = string[] | [true]> = (RequiredArg<T> | OptionalArg<T>)[];
type WideFlags = Flag[];

interface JSONFileContent {
  [key: string]: { __doc__?: string, [key: string]: string | undefined };
}

type TrueToString<T> = T extends true ? string : T;

type MapToValues<T extends WideArgs> = T extends [infer First extends WideArgs[number], ...infer Rest extends WideArgs] 
  ? [
      ...(First extends OptionalArg
            ? First["default"] extends string
              ? [TrueToString<First["values"][number]>]
              : [TrueToString<First["values"][number]>?]
        : [TrueToString<First["values"][number]>]), 
      ...MapToValues<Rest>
    ]
  : [];

type ExtractFlags<F extends WideFlags> = NonNullable<F[number]["name"] | F[number]["alias"]>;

interface Command<A extends WideArgs, F extends WideFlags> {
  readonly name: string;
  readonly desc: string;
  readonly args: A;
  readonly flags: F;
  callback(
    args: MapToValues<A>,
    flags: ExtractFlags<F>[]
  ): void;
}