/** Represents an "instance" of the enum fake object */
type EnumInstance<T extends readonly string[]> = {
    readonly [K in T[number]]: symbol;
} & {
    [Symbol.iterator](): IterableIterator<T[number]>
};

/** The constructor for the `Future` class, which is a type-safe `Promise` (it has all the same properties of a promise) */
interface FutureConstructor extends PromiseConstructor {
    new <T, R extends Error = Error>(executor: (resolve: (value: T) => void, reject: (err?: R) => void) => void): Future<T, R>;
}

interface RegistryManifest {
    readonly HTML_TAGS: RegistryOf<HTMLTag, Class<HTMLElement>>;
}

/** The types for the `Future` class */
interface Future<T, R extends Error = Error> extends Promise<T> {
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

//* Errors

interface ErrorConstructorOf<Inst extends Error = Error> {
    new (message?: string, options?: ErrorOptions): Inst;
    readonly prototype: Inst;
}

/** The constructor for runtime errors */
interface RuntimeErrorConstructor {
    new (message?: string, cause?: unknown): RuntimeError;
    readonly prototype: RuntimeError;
}

/**
 * The class representing runtime errors
 * @opti
 * @since 1.0.0
 */
interface RuntimeError {
    name: 'RuntimeError';
    message: string;
    stack?: string;
    cause?: unknown;
}

interface UnknownError extends Error {}
interface UnknownErrorConstructor extends ErrorConstructorOf<UnknownError> {}

interface DebouncedError extends Error {}
interface DebouncedErrorConstructor extends ErrorConstructorOf<DebouncedError> {}

interface NotImplementedError extends Error {}
interface NotImplementedErrorConstructor extends ErrorConstructorOf<NotImplementedError> {}

interface AccessError extends Error {}
interface AccessErrorConstructor extends ErrorConstructorOf<AccessError> {}

interface AssertionError extends Error {}
interface AssertionErrorConstructor extends ErrorConstructorOf<AssertionError> {}

interface FetchError extends Error {}
interface FetchErrorConstructor extends ErrorConstructorOf<FetchError> {}

interface CloneError extends Error {}
interface CloneErrorConstructor extends ErrorConstructorOf<CloneError> {}

interface HierarchyError extends Error {}
interface HierarchyErrorConstructor extends ErrorConstructorOf<HierarchyError> {}

interface NumberError extends Error {}
interface NumberErrorConstructor extends ErrorConstructorOf<NumberError> {}

interface NumberTooSmallError extends Error {}
interface NumberTooSmallErrorConstructor extends ErrorConstructorOf<NumberTooSmallError> {}

interface NumberTooLargeError extends Error {}
interface NumberTooLargeErrorConstructor extends ErrorConstructorOf<NumberTooLargeError> {}

interface RegistryError extends Error {}
interface RegistryErrorConstructor extends ErrorConstructorOf<RegistryError> {}

interface UnnecessaryError extends Error {}
interface UnnecessaryErrorConstructor extends ErrorConstructorOf<UnnecessaryError> {}

interface InvalidSelectorError extends SyntaxError {}
interface InvalidSelectorErrorConstructor extends ErrorConstructorOf<InvalidSelectorError> {}

interface FloatingNumberError extends NumberError {}
interface FloatingNumberErrorConstructor extends ErrorConstructorOf<FloatingNumberError> {}

interface DuplicateIDError extends Error {}
interface DuplicateIDErrorConstructor extends ErrorConstructorOf<DuplicateIDError> {}