interface JSON {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse<T = any, R = T>(text: string, reviver?: (this: T, key: string, value: T) => R): R;
}