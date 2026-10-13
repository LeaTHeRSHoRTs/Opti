// This module uses Object.assign to assign to globalThis. 
// Do NOT add any exported members that are not in the documentation
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
export class NotImplementedError extends Error {}

//#region NumberErrors
export class NumberError extends Error {} 
export class FloatingNumberError extends NumberError {}
//#endregion
export class UnknownError extends Error {}
export class AccessError extends Error {}
export class AssertionError extends Error {}
export class FetchError extends Error {}
export class DebouncedError extends Error {}
export class RegistryError extends Error {}
export class UnnecessaryError extends Error {}
export class InvalidSelectorError extends SyntaxError {}
export class DuplicateIDError extends Error {}