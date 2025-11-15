import * as Classes from "./classes";
import * as Doc from "./document";
import * as Elements from "./elements";
import * as Exceptions from "./exception";
import * as Globals from "./globals";
import * as Lists from "./lists";
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
  globalThis.RuntimeException = Exceptions.RuntimeException;

  globalThis.Abstract = Decorators.Abstract;
  globalThis.Final = Decorators.Final;

  Object.defineProperty(globalThis, "f", {
    value: <T>(iife: () => T) => iife(),
    writable: false,
    configurable: false,
  });
  globalThis.type = Globals.type;
  globalThis.assert = Globals.assert;
  globalThis.sleep = Globals.sleep;
  globalThis.isEmpty = Globals.isEmpty;
  globalThis.notEmpty = Globals.notEmpty;

  globalThis.Enum = Classes.Enum;
  globalThis.Tuple = Classes.Tuple;

  get(Window.prototype, "width", () => window.innerWidth || document.body.clientWidth );
  get(Window.prototype, "height", () => window.innerHeight || document.body.clientHeight );

  Document.prototype.ready = Doc.ready;
  Document.prototype.leaving = Doc.leaving;
  Document.prototype.css = Doc.documentCss;
  Document.prototype.createElements = Doc.createElements;

  Node.prototype.$ = Elements.$;
  Node.prototype.$$ = Elements.$$;
  Node.prototype.parent = Elements.getParent;
  Node.prototype.ancestor = Elements.getAncestor;
  Node.prototype.getChildren = Elements.getChildren;
  Node.prototype.siblings = Elements.getSiblings;

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

  Object.defineProperty(HTMLInputElement.prototype, "val", function(this: HTMLInputElement) { return Elements.val(this); });

  HTMLFormElement.prototype.serialize = Elements.serialize;

  NodeList.prototype.addClass = Lists.addClassList;
  NodeList.prototype.removeClass = Lists.removeClassList;
  NodeList.prototype.toggleClass = Lists.toggleClassList;

  HTMLCollection.prototype.addClass = Lists.addClassList;
  HTMLCollection.prototype.removeClass = Lists.removeClassList;
  HTMLCollection.prototype.toggleClass = Lists.toggleClassList;

  EventTarget.prototype.addEventListener = Misc.addEventListener;
  (EventTarget.prototype as any)._events = {};
  get(EventTarget.prototype, "events", function(this: EventTarget) { return (this as any)["_events"] as EventTarget["events"]; });

  String.prototype.remove = Misc.remove;
  String.prototype.matches = Misc.matches;
  String.prototype.removeAll = Misc.removeAll;
  String.prototype.capitalize = Misc.capitalize;
  String.prototype.toCase = Misc.toCase;

  Number.prototype.repeat = Misc.repeat;

  Function.debounce = Misc.debounce;
  Function.throttle = Misc.throttle;
  Function.memo = Misc.memo;
  Function.prototype.getArgs = Misc.args;

  Array.prototype.unique = Misc.unique;
  Array.prototype.chunk = Misc.chunk;
  Array.prototype.pluck = Misc.pluck;
  Array.prototype.pluckLast = Misc.pluckLast;
  Array.prototype.relocate = Misc.relocate;
  Array.prototype.relocateTo = Misc.relocateTo;
  Array.prototype.replace = Misc.replace;
  Array.prototype.sort = Misc.sortBy;
  Array.prototype.insert = Misc.insert;
  get(Array.prototype, "type", Misc.arrayType);

  Math.random = Misc.random;

  Object.clone = Misc.clone;
  Object.forEach = Misc.forEach;

  Date.at = Misc.atDate;
  Date.fromTime = Misc.fromTime;

  console = Misc.consoleProxy;
  console.group = Misc.group;
  console.on = Misc.consoleOn;
  console.off = Misc.consoleOff;
})();