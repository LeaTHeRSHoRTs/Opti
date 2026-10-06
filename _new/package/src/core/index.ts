import { setGetter, setReadOnly } from "../helpers";
import * as Classes from "./constructableobjects";
import * as Doc from "./document";
import * as Elements from "./nodes";
import * as Errors from "./errors";
import * as Globals from "./globals";
import * as Lists from "./collections";
import * as Arrays from "./arrays";
import * as Misc from "./misc";
import * as Reg from "./registry";

if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("Opti requires a browser environment.");
}

type __Unsafe<T> = T & Record<string, unknown>;

globalThis.Opti = {
    crafty: false,
    query: false,
    unsync: false,
    requests: false,
    flow: false
};

//! Others may depend on these
globalThis.RegistryError = Errors.RegistryError;
globalThis.Future = Promise;
globalThis.InternalRegistries = Reg.InternalRegistries;
globalThis.Registries = Reg.Registries;

globalThis.CloneError = Errors.CloneError;
globalThis.NumberTooSmallError = Errors.NumberTooSmallError;
globalThis.NotImplementedError = Errors.NotImplementedError;
globalThis.AccessError = Errors.AccessError;
globalThis.UnknownError = Errors.UnknownError;
globalThis.DebouncedError = Errors.DebouncedError;
globalThis.AssertionError = Errors.AssertionError;
globalThis.FetchError = Errors.FetchError;
globalThis.HierarchyError = Errors.HierarchyError;
globalThis.RuntimeError = Errors.RuntimeError;

setReadOnly(globalThis, "f", <T, P extends unknown[], R>(
    iife: Func<T, P, R>,
    args?: P,
    thisArg?: T
): R => {
    return iife.apply(thisArg as T, (args || []) as P);
});

globalThis.is = Globals.is;
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
Node.prototype.cut = Elements.cut;
(Node.prototype as __Unsafe<Node>).parent = Elements.getParent;        // ChildNode
(Node.prototype as __Unsafe<Node>).ancestor = Elements.getAncestor;    // ChildNode
(Node.prototype as __Unsafe<Node>).getChildren = Elements.getChildren; // ParentNode
(Node.prototype as __Unsafe<Node>).siblings = Elements.getSiblings;    // ChildNode

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
setGetter(HTMLElement.prototype, "isVisible", Elements.isVisible);

setGetter(HTMLInputElement.prototype, "val", Elements.val);

HTMLFormElement.prototype.serialize = Elements.serialize;

NodeList.prototype.addClass = Lists.addClassList;
NodeList.prototype.removeClass = Lists.removeClassList;
NodeList.prototype.toggleClass = Lists.toggleClassList;

HTMLCollection.prototype.addClass = Lists.addClassList;
HTMLCollection.prototype.removeClass = Lists.removeClassList;
HTMLCollection.prototype.toggleClass = Lists.toggleClassList;

String.prototype.remove = Misc.remove;
String.prototype.matches = Misc.matches;
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
Array.prototype.sort = Arrays.sortBy;
Array.prototype.insert = Arrays.insert;

Math.randomRange = Misc.randomRange;

Object.clone = Misc.clone;
Object.forEach = Misc.forEach;

Date.at = Misc.atDate;