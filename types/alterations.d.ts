interface JSON {
  parse<T = any>(text: string, reviver?: (this: T, key: string, value: any) => any): T
}

interface ObjectConstructor {
  entries<T extends object>(obj: T): [keyof T, T[keyof T]][]
}