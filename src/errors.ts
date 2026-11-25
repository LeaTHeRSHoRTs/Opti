// This module uses Object.assign to assign to globalThis. 
// Do NOT add any exported members that are not in the documentation
export class RuntimeError {
    name = 'RuntimeError' as const;
    message: string;
    cause: unknown;
    stack: string;

    public constructor(message: string = "", cause: unknown = "") {
        this.message = message;
        this.cause = cause;
        this.stack = new Error().stack ?? "";
    }
}

export class CloneError extends Error {
    name = "CloneError";
}
export class HierarchyError extends Error {
    name = "HierarchyError";
}
export class NotImplementedError extends Error {
    name = "NotImplementedError";
}

//#region NumberErrors
export class NumberError extends Error {
    name = "NumberError";
} 
export class FloatingNumberError extends NumberError {
    name = "FloatingNumberError";
}
//#endregion
export class UnknownError extends Error {
    name = "UnknownError";
}
export class AccessError extends Error {
    name = "AccessError";
}
export class AssertionError extends Error {
    name = "AssertionError";
}
export class FetchError extends Error {
    name = "FetchError";
}
export class DebouncedError extends Error {
    name = "DebouncedError";
}
export class RegistryError extends Error {
    name = "RegistryError";
}
export class UnnecessaryError extends Error {
    name = "UnnecessaryError";
}
export class InvalidSelectorError extends SyntaxError {
    name = "InvalidSelectorError";
}
export class DuplicateIDError extends Error {
    name = "DuplicateIDError";
}