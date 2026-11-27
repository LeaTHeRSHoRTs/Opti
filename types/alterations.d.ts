/* eslint-disable jsdoc/require-jsdoc */

interface JSON {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any esdoc/require-jsdoc
    parse<T = any, R = T>(text: string, reviver?: (this: T, key: string, value: T) => R): R;
}