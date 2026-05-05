/// <reference path="../../types/Core/opti.lib.d.ts" />

import { OptiInitError, setGetter, setNotEnumerable, setReadOnly } from "../helpers/helpers";
import * as Classes from "./constructableobjects";
import * as Doc from "./document";
import * as Elements from "./nodes";
import * as Exceptions from "./exceptions";
import * as Globals from "./globals";
import * as Lists from "./collections";
import * as Arrays from "./arrays";
import * as Events from "./events";
import * as Misc from "./misc";
import * as Reg from "./registry";

console.log('Window type:', typeof window);

if (typeof window === "undefined" || typeof document === "undefined") {
  throw new OptiInitError("Opti requires a browser environment.");
}

type __Unsafe<T = GlobalThis> = T & Record<string, unknown>;

globalThis.Opti = {
  crafty: false,
  query: false,
  unsync: false,
  requests: false,
  flow: false
};

//! Others may depend on these
globalThis.RegistryException = Exceptions.RegistryException;
globalThis.Future = Promise;
globalThis.InternalRegistries = Reg.InternalRegistries;
globalThis.Registries = Reg.Registries;

(globalThis as __Unsafe).Exception = Exceptions.Exception;
globalThis.SyntaxException = Exceptions.SyntaxException;
globalThis.TypeException = Exceptions.TypeException;
globalThis.CloneException = Exceptions.CloneException;
globalThis.NumberTooSmallException = Exceptions.NumberTooSmallException;
globalThis.NotImplementedException = Exceptions.NotImplementedException;
globalThis.AccessException = Exceptions.AccessException;
globalThis.UnknownException = Exceptions.UnknownException;
globalThis.DebouncedException = Exceptions.DebouncedException;
globalThis.AbstractMethodInvokedException = Exceptions.AbstractMethodInvokedException;
globalThis.AbstractInitializationException = Exceptions.AbstractInitializationException;
globalThis.AssertionException = Exceptions.AssertionException;
globalThis.FetchException = Exceptions.FetchException;
globalThis.HierarchyException = Exceptions.HierarchyException;
globalThis.IncorrectDecoratorPlacementException = Exceptions.IncorrectDecoratorPlacementException;
globalThis.RuntimeException = Exceptions.RuntimeException;

setReadOnly(globalThis as __Unsafe, "Missing", Symbol("Missing"));
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
[HTMLDocument, Document].forEach(el => el.prototype.createElements = Doc.createElements);

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

EventTarget.prototype.addEventListener = Events.addEventListener;
setNotEnumerable(EventTarget.prototype as unknown as { _events: unknown }, "_events", {});

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