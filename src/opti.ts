import * as Classes from "./constructableobjects";
import * as Doc from "./document";
import * as Elements from "./elements";
import * as Exceptions from "./exception";
import * as Globals from "./globals";
import * as Lists from "./collections";
import * as Arrays from "./arrays";
import * as Misc from "./misc";
import * as Decorators from "./decorators";

function get<T>(
  object: T,
  prop: keyof T,
  getter: () => any
): void {
  Object.defineProperty(object, prop, {
    get: getter,
    enumerable: false,
    configurable: true
  });
}

(function() {
  let _evFuncData;
  let _evFuncType;

  globalThis.opti = {
    crafty: false,
    query: false,
    evented: false,
    requests: false,
    flow: false
  };

  //! Others may depend on these
  globalThis.Collection = Classes.Collection;
  globalThis.Future = Promise;

  globalThis.Exception = Exceptions.Exception;
  globalThis.SyntaxException = Exceptions.SyntaxException;
  globalThis.TypeException = Exceptions.TypeException;
  globalThis.CloneException = Exceptions.CloneException;
  globalThis.NumberTooSmallException = Exceptions.NumberTooSmallException;
  globalThis.AssertionException = Exceptions.AssertionException;
  globalThis.NotImplementedException = Exceptions.NotImplementedException;
  globalThis.AccessException = Exceptions.AccessException;
  globalThis.UnknownException = Exceptions.UnknownException;
  globalThis.DebouncedException = Exceptions.DebouncedException;
  globalThis.AbstractMethodInvokedException = Exceptions.AbstractMethodInvokedException;
  globalThis.AbstractInitializationException = Exceptions.AbstractInitializationException;
  globalThis.SortException = Exceptions.SortException;
  globalThis.CollectionOutOfBoundsException = Exceptions.CollectionOutOfBoundsException;
  globalThis.MalformedQueryException = Exceptions.MalformedQueryException;
  globalThis.RuntimeException = Exceptions.RuntimeException;

  globalThis.Abstract = Decorators.Abstract;
  globalThis.Final = Decorators.Final;

  Object.defineProperty(globalThis, "f", {
    value: <T>(iife: () => T) => iife(),
    writable: false,
    configurable: false,
  });
  globalThis.typed = Globals.typed;
  globalThis.assert = Globals.assert;
  globalThis.sleep = Globals.sleep;
  globalThis.isEmpty = Globals.isEmpty;
  globalThis.notEmpty = Globals.notEmpty;

  globalThis.Enum = Classes.Enum;
  globalThis.Tuple = Classes.Tuple;

  Document.prototype.ready = Doc.ready;
  Document.prototype.leaving = Doc.leaving;
  Document.prototype.css = Doc.documentCss;
  Document.prototype.createElements = Doc.createElements;

  Node.prototype.$ = Elements.$;
  Node.prototype.$$ = Elements.$$;
  Node.prototype.cut = Elements.cut;
  Node.prototype.parent = Elements.getParent;
  Node.prototype.ancestor = Elements.getAncestor;
  Node.prototype.getChildren = Elements.getChildren;
  Node.prototype.siblings = Elements.getSiblings;

  Element.prototype.copy = Elements.copy;
  Element.prototype.hasText = Elements.hasText;
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
  get(HTMLElement.prototype, "isVisible", Elements.isVisible);

  get(HTMLInputElement.prototype, "val", Elements.val);

  HTMLFormElement.prototype.serialize = Elements.serialize;

  NodeList.prototype.addClass = Lists.addClassList;
  NodeList.prototype.removeClass = Lists.removeClassList;
  NodeList.prototype.toggleClass = Lists.toggleClassList;

  HTMLCollection.prototype.addClass = Lists.addClassList;
  HTMLCollection.prototype.removeClass = Lists.removeClassList;
  HTMLCollection.prototype.toggleClass = Lists.toggleClassList;

  EventTarget.prototype.addEventListener = Misc.addEventListener;
  (EventTarget.prototype as any)._events = {};
  EventTarget.prototype.getEvents = Misc.getEvents;

  String.prototype.remove = Misc.remove;
  String.prototype.matches = Misc.matches;
  String.prototype.capitalize = Misc.capitalize;
  String.prototype.toCase = Misc.toCase;

  Number.prototype.repeat = Misc.repeat;

  Function.debounce = Misc.debounce;
  Function.throttle = Misc.throttle;
  Function.memo = Misc.memo;
  Function.prototype.debounce = Misc.instDebounce;
  Function.prototype.throttle = Misc.instThrottle;
  Function.prototype.memo = Misc.instMemo;
  get(Function.prototype, "args", Misc.args);

  Array.prototype.unique = Arrays.unique;
  Array.prototype.chunk = Arrays.chunk;
  Array.prototype.pluck = Arrays.pluck;
  Array.prototype.pluckLast = Arrays.pluckLast;
  Array.prototype.relocate = Arrays.relocate;
  Array.prototype.relocateTo = Arrays.relocateTo;
  Array.prototype.replace = Arrays.replace;
  Array.prototype.replaceLast = Arrays.replaceLast;
  Array.prototype.sort = Arrays.sortBy;
  Array.prototype.insert = Arrays.insert;
  get(Array.prototype, "type", Arrays.arrayType);

  Math.random = Misc.random;

  Object.clone = Misc.clone;
  Object.forEach = Misc.forEach;

  Date.at = Misc.atDate;
})();