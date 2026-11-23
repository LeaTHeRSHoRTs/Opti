declare global {
    namespace Query {
        interface Error extends globalThis.Error { }
        interface ErrorConstructor extends globalThis.ErrorConstructorOf<Error> { }
    }
}

export { };