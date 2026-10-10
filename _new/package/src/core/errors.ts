export class RuntimeError {
    name: 'RuntimeError' = "RuntimeError";
    message: string;
    cause: unknown;
    stack: string;

    public constructor(message: string = "", cause: unknown = "") {
        this.message = message;
        this.cause = cause;
        this.stack = new Error().stack ?? "";
    }
}

export class CloneError extends Error {}
export class HierarchyError extends Error {}
export class NumberError extends Error {}
export class NumberTooSmallError extends NumberError {}
export class NotImplementedError extends Error {}
export class UnknownError extends Error {}
export class AccessError extends Error {}
export class AssertionError extends Error {}
export class FetchError extends Error {}
export class DebouncedError extends Error {}
export class RegistryError extends Error {}