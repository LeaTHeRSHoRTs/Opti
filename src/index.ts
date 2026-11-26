if (
    typeof window === 'undefined' || 
    typeof document === 'undefined'
) throw new Error("Opti requires a browser environment.");

const { setGetter, setReadOnly, throwPlaceholder } = await import('./helpers');
const Classes =  await import('./classes');
const Doc =      await import('./document');
const Elements = await import('./nodes');
const Errors =   await import('./errors');
const Globals =  await import('./globals');
const Lists =    await import('./collections');
const Arrays =   await import('./arrays');
const Misc =     await import('./misc');
const Reg =      await import('./registry');

globalThis.Opti = {
    crafty: false,
    query: false,
    unsync: false,
    request: false,
    flow: false
};

//! Others may depend on these
globalThis.RegistryError = Errors.RegistryError;
globalThis.Future = Promise;
//@ts-expect-error
globalThis.InternalRegistries = Reg.InternalRegistries;
globalThis.Registries = Reg.Registries;
Array.prototype.asArr = Arrays.asArr;
Object.assign(globalThis, Errors);

// eslint-disable-next-line prefer-arrow-callback
globalThis.placeholder = new Proxy(function () {}, {
    get:            throwPlaceholder,
    set:            throwPlaceholder,
    has:            throwPlaceholder,
    ownKeys:        throwPlaceholder,
    getPrototypeOf: throwPlaceholder,
    apply:          throwPlaceholder,
    construct:      throwPlaceholder
});

// f(...)
setReadOnly(globalThis, 'f', <T, P extends unknown[], R>(
    iife: Func<T, P, R>,
    args?: P,
    thisArg?: T
): R => iife.apply(thisArg as T, (args || []) as P));

globalThis.cast = Globals.cast;
globalThis.assert = Globals.assert;
globalThis.sleep = Globals.sleep;
globalThis.isEmpty = Globals.isEmpty;
globalThis.Enum = Classes.Enum;
globalThis.Tuple = Classes.Tuple;

[HTMLDocument, Document].forEach(el => el.prototype.ready = Doc.ready);
[HTMLDocument, Document].forEach(el => el.prototype.leaving = Doc.leaving);
[HTMLDocument, Document].forEach(el => el.prototype.css = Doc.documentCss);

Node.prototype.$ = Elements.$;
Node.prototype.$$ = Elements.$$;
Node.prototype.parent = Elements.getParent;
Node.prototype.ancestor = Elements.getAncestor;
Node.prototype.siblings = Elements.getSiblings;
Node.prototype.getChildren = Elements.getChildren;

Element.prototype.copy = Elements.copy;
Element.prototype.txt = Elements.text;
Element.prototype.html = Elements.html;
Element.prototype.addClass = Elements.addClass;
Element.prototype.removeClass = Elements.removeClass;
Element.prototype.toggleClass = Elements.toggleClass;
Element.prototype.hasClass = Elements.hasClass;
Element.prototype.attr = Elements.attr;

HTMLElement.prototype.css = Elements.css;
HTMLElement.prototype.show = Elements.show;
HTMLElement.prototype.hide = Elements.hide;
HTMLElement.prototype.toggle = Elements.toggle;
setGetter(HTMLElement.prototype, 'isVisible', Elements.isVisible);

setGetter(HTMLInputElement.prototype, 'val', Elements.val);
HTMLFormElement.prototype.serialize = Elements.serialize;

NodeList.prototype.addClass = Lists.addClassList;
NodeList.prototype.removeClass = Lists.removeClassList;
NodeList.prototype.toggleClass = Lists.toggleClassList;

HTMLCollection.prototype.addClass = Lists.addClassList;
HTMLCollection.prototype.removeClass = Lists.removeClassList;
HTMLCollection.prototype.toggleClass = Lists.toggleClassList;

String.prototype.remove = Misc.remove;
String.prototype.contains = Misc.contains;
String.prototype.capitalize = Misc.capitalize;
String.prototype.toCase = Misc.toCase;

Number.prototype.repeat = Misc.repeat;

Function.debounce = Misc.debounce;
Function.throttle = Misc.throttle;
Function.memo = Misc.memo;

Array.prototype.unique = Arrays.unique;
Array.prototype.chunk = Arrays.chunk;
Array.prototype.pluck = Arrays.pluck;
Array.prototype.pluckLast = Arrays.pluckLast;
Array.prototype.relocate = Arrays.relocate;
Array.prototype.relocateTo = Arrays.relocateTo;
Array.prototype.replace = Arrays.replace;
Array.prototype.sortBy = Arrays.sortBy;
Array.prototype.insert = Arrays.insert;

Math.randomRange = Misc.randomRange;
Math.randomIntRange = Misc.randomIntRange;

Object.clone = Misc.clone;
Object.forEach = Misc.forEach;

Date.at = Misc.atDate;

export {}