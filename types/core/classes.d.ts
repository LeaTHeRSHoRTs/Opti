/* eslint-disable jsdoc/require-returns */
/** 
 * Represents an "instance" of the enum fake object
 * @opti
 * @since 1.0.0 
 */
type EnumInstance<T extends readonly string[]> = {
    readonly [K in T[number]]: symbol;
} & {
    // eslint-disable-next-line jsdoc/require-example
    /**
     * Provides iteration over each element in the enum
     * @opti
     * @since 1.0.0
     */
    [Symbol.iterator](): IterableIterator<T[number]>;
};

/** 
 * The constructor for the `Future` class, which is a type-safe `Promise`
 * @opti
 * @since 1.0.0
 */
interface FutureConstructor extends PromiseConstructor {
    new <T, R extends Error = Error>(executor: (resolve: (value: T) => void, reject: (err?: R) => void) => void): Future<T, R>;
}

interface RegistryManifest {
    readonly HTML_TAGS: RegistryOf<HTMLTag, Class<HTMLElement>>;
}

/**
 * The types for the `Future` class
 * @opti
 * @since 1.0.0
 */
interface Future<T, R extends Error = Error> extends Promise<T> {
    /**
     * Attaches callbacks for the resolution and/or rejection of the {@linkcode Future}
     * @opti
     * @since 1.0.0
     * @param onfulfilled Called when the {@linkcode Future} is fulfilled, receiving its resolved value
     * @param onrejected Called when the {@linkcode Future} is rejected, receiving its rejection reason
     * @returns A {@linkcode Future} resolved with the result of the executed callback
     * @example
     * const future: Future<number, Error> = new Future((resolve, reject) => {
     *   if (Math.random() > 0.5) resolve(42);
     *   else reject(new Error("Something went wrong"));
     * });
     * 
     * future.then((value: number) => {
     *   return value * 2;
     * });
     */
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: R) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Future<TResult1 | TResult2, R>;

    /**
     * Attaches a callback for only the rejection of the {@linkcode Future}
     * @opti
     * @since 1.0.0
     * @param onrejected The callback to execute if the {@linkcode Future} is rejected, receiving its rejection reason
     * @returns A Future that resolves with the result of the callback or propagates an unhandled rejection
     * @example
     * const future: Future<number, Error> = new Future((resolve, reject) => {
     *   if (Math.random() > 0.5) resolve(42);
     *   else reject(new Error("Something went wrong"));
     * });
     * 
     * future.catch((error: Error) => {
     *   console.error(error.message);
     *   return 0;
     * });
     */
    catch<TResult = never>(
        onrejected?: ((reason: R) => TResult | PromiseLike<TResult>) | undefined | null
    ): Future<T | TResult, R>;

    /**
     * Attaches a callback that is invoked when the {@linkcode Future} is settled (fulfilled or rejected)
     * @opti
     * @since 1.0.0
     * @param onfinally The callback to execute after the Future settles, regardless of its outcome
     * @returns A {@linkcode Future} that preserves the original outcome unless the callback throws an error or returns a rejected Promise
     * @example
     * const future: Future<number, Error> = new Future((resolve, reject) => {
     *   if (Math.random() > 0.5) resolve(42);
     *   else reject(new Error("Something went wrong"));
     * });
     * 
     * future.finally(() => {
     *   console.log("Future settled");
     * });
     */
    finally(onfinally?: (() => void) | undefined | null): Future<T, R>;
}

//* Errors

interface ErrorConstructorOf<Inst extends Error = Error> {
    new (message?: string, options?: ErrorOptions): Inst;
    readonly prototype: Inst;
}

/**
 * The constructor for runtime errors
 * @opti
 * @since 1.0.0
 */
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


// These are documented in the index.d.ts file for Opti
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