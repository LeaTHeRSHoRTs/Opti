/// <reference path="./opti.d.ts" />
/// <reference path="./deprecation.d.ts" />
/// <reference path="./alterations.d.ts" />
/// <reference path="./classes.d.ts" />

/* eslint-disable no-var */

/** 
 * Creates an iife (Immediately invoked function expression) that triggers on run 
 * @opti
 * @param iife The function to run the code in for the iife
 */
declare function f<T>(iife: () => T): T;

/**
 * Gets the type of the value and returns a string representation of the type of the value
 * @opti
 * @param val The value who's type is being tested
 * @example
 * type(5).stringOf()           // "number"
 * type("hello").stringOf()     // "string"
 * type(null).stringOf()        // "null"
 * type(undefined).stringOf()   // "undefined"
 * type([1,2,3]).stringOf()     // "array"
 * type({}).stringOf()          // "object"
 * type(new Date()).stringOf()  // "date"
 * type(/abc/).stringOf()       // "regexp"
 * type(() => {}).stringOf()    // "function"
 * type(new Map()).stringOf()   // "map"
 * type(new Set()).stringOf()   // "set"
 */
declare function typed<T>(val: T): TypeGuard<T>;

/**
 * Asserts whether `condition` is true or not and throws an {@linkcode AssertionException} if it fails
 * @opti
 * @throws AssertException
 * @param condition The condition to test
 * @example
 * let mayVar = 32;
 * if (Math.random() > 0.5) {
 *   myVar = 33;
 * }
 * 
 * assert(myVar === 33); // From now on, intellisense thinks that myVar: 33
 * console.log(myVar); // Will not log if myVar is 32 before the assertion
 */
declare function assert(condition: boolean): asserts condition;
declare function assert<T>(value: any): asserts value is T;

/**
 * Cheks whether the value given is empty, `null`, or `undefined`
 * 
 * See {@linkcode notEmpty} for inverse function
 * @opti
 * @param value The value to check
 * @example
 * isEmpty(""); // true
 * isEmpty("Hello"); // false
 * isEmpty(NaN); // true
 * isEmpty(0); // false
 * isEmpty({}); // true
 * isEmpty([]); // true
 * isEmpty([1, 2]); // false
 */
declare function isEmpty(val: string): val is "";
declare function isEmpty(val: number): val is typeof NaN;
declare function isEmpty(val: boolean): val is false;
declare function isEmpty(val: null | undefined): true;
declare function isEmpty(val: [...any]): val is [];
declare function isEmpty(val: Record<Key, unknown>): val is Record<Key, never>;
declare function isEmpty(val: Map<any, any>): val is Map<any, never>;
declare function isEmpty(val: Set<any>): val is Set<never>;
declare function isEmpty(val: WeakMap<object, any>): val is WeakMap<object, any>;
declare function isEmpty(val: WeakSet<object>): val is WeakSet<object>;
declare function isEmpty(val: any): boolean;

/**
 * Inverse function to {@linkcode isEmpty}
 * @opti
 * @param value The value to check
 * @example
 * isEmpty("") === notEmpty("Hello") // true
 */
declare function notEmpty(val: string | ""): val is string;
declare function notEmpty(val: number | 0): val is number;
declare function notEmpty(val: boolean): val is true;
declare function notEmpty(val: null | undefined): false;
declare function notEmpty(val: [...any] | []): val is [any, ...any];
declare function notEmpty(val: Record<Key, unknown>): val is Record<Key, unknown>;
declare function notEmpty(val: Map<any, any>): val is Map<any, never>;
declare function notEmpty(val: Set<any>): val is Set<never>;
declare function notEmpty(val: WeakMap<object, any>): val is WeakMap<object, any>;
declare function notEmpty(val: WeakSet<object>): val is WeakSet<object>;
declare function notEmpty(val: any): boolean;

/**
 * Waits the specified number of ms before returning control to the then block, or the main program
 * @opti
 * @param ms The amout of milliseconds to wait
 * @example
 * console.log("I log when the program runs!")
 * 
 * await sleep(500);
 * 
 * console.log("I wait 5 seconds before executing!")
 */
declare function sleep(ms: number): Promise<void>;

// /**
//  * Makes a function mixin and returns that mixin for other use
//  * @opti
//  * @param fn The function to use for the mixin
//  * @param location The location to put the `mixinFn`'s code
//  * @param mixinFn The function taht will be inserted into `fn`
//  */
// declare function mixin<T extends Func>(fn: T, location: "HEAD", mixinFn: T): T;
// declare function mixin<T extends Func, This = ThisParameterType<T>, Ret = ReturnType<T>>(fn: T, location: "TAIL", mixinFn: (this: This & { mixin: { value: Ret } }, ...args: Parameters<T>) => Ret): T

// /**
//  * Colorizes a string based on the colorized syntax
//  * @opti
//  * @example
//  * Colorize`{color:red}Red Text!{/color:red}`
//  */
// declare function Colorize(strings: TemplateStringsArray, ...values: any[]): string;

/**
 * Creates a new typesafe enum full of Symbols
 * @opti
 * @param values The enum's values
 * @example
 * const Colors = Enum("RED", "ORAGNE", "YELLOW", "GREEN", "BLUE")
 * 
 * const color = Colors.ORANGE
 * switch(Color) {
 *   case Color.RED:
 *     console.log("Red")
 *     break;
 *   case Color.ORANGE:
 *     console.log("Orange")
 *     break;
 *   case Color.YELLOW:
 *     console.log("Yellow")
 *     break;
 *   case Color.GREEN:
 *     console.log("Green")
 *     break;
 *   case Color.BLUE:
 *     console.log("Blue")
 *     break;
 *   default:
 *     console.log("Unknown number")
 *     break;
 * }
 */
declare function Enum<T extends readonly string[]>(...values: T): EnumInstance<T>

/**
 * Creates a tuple of values from a spread provided
 * @opti
 * @param values The values to use for the tuple
 * @example
 * const myTuple = Tuple("X", 2, true); // [string, number, boolean]
 */
declare function Tuple<T extends unknown[]>(...values: T): T

// /**
//  * Info about `Opti`
//  * @opti
//  */
// declare var opti: OptiObject;

declare var NEVER: never;

/**
 * Base class for all the Opti Exceptions
 */
declare var Exception: ExceptionConstructor;

/**
 * Exception that cannot be caught using `instanceof Exception` or `instanceof Error`
 */
declare var RuntimeException: RuntimeExceptionConstructor;

/**
 * Exception for unimplemented things
 */
declare var NotImplementedException: SubExceptionConstructor;

/**
 * Exception for unknown causes
 */
declare var UnknownException: UnknownExceptionConstructor;

/**
 * Exception for illegal access
 */
declare var AccessException: SubExceptionConstructor;

/**
 * Error for assertion related errors
 */
declare var AssertionException: SubExceptionConstructor;

/**
 * Exception for starting a new debounce
 */
declare var DebouncedException: DebouncedExceptionConstructor;
declare var SyntaxException: SyntaxExceptionConstructor;
declare var TypeException: TypeExceptionConstructor;
declare var CloneException: CloneExceptionConstructor;
declare var NumberTooSmallException: NumberTooSmallExceptionConstructor;
declare var AbstractInitializationException: AbstractInitializationExceptionConstructor;
declare var AbstractMethodInvokedException: AbstractMethodInvokedExceptionConstructor;
declare var SortException: SortExceptionConstructor;
declare var CollectionOutOfBoundsException: CollectionOutOfBoundsExceptionConstructor;
declare var MalformedQueryException: MalformedQueryExceptionConstructor;

/**
 * The collection class that can make collections of any object
 */
declare var Collection: CollectionConstructor;

declare var Future: FutureConstructor;

declare var opti: OptiObject;

/** @decorator */
declare var Abstract: MethodDecorator & ClassDecorator;

/** @decorator */
declare function Final(
  target: any,
): ClassDecorators;
/** @decorator */
declare function Final(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): void;

interface Document {
  /** 
   * Adds, edits and returns the element's css on the document stylesheet.
   * @opti
   * @example
   * document.css("#target", {
   *   backgroundColor: "red",
   *   color: "grey"
   * })
   */
  css(
    element: keyof HTMLElementTagNameMap
  ): Partial<Record<keyof CSSStyleDeclaration, string>>;
  css(
    element: keyof HTMLElementTagNameMap,
    object: Partial<Record<keyof CSSStyleDeclaration, string | number>>
  ): void;
  css(
    element: string
  ): Partial<Record<keyof CSSStyleDeclaration, string>>;
  css(
    element: string,
    object: Partial<Record<keyof CSSStyleDeclaration, string | number>>
  ): void;

  /**
   * Calls the callback when the document is ready and all of the content is loaded
   * @opti
   * @param callback The function to call when the document is ready
   * @example
   * document.ready(() => {
   *   console.log("Document is ready");
   * 
   *   // Works because the document is ready
   *   const el = document.$("body");
   * })
   */
  ready(callback: (this: Document, ev: Event) => any): void;

  /**
   * Calls the callback when the user leaves the page or website
   * @opti
   * @param callback The function to call when the user leaves the page or website
   * @example
   * document.leaving(() => {
   *   console.log("User is Leaving");
   * 
   *   // Cleanup tasks
   *   localStorage.clear();
   *   Cookie.clear();
   * })
   */
  leaving(callback: (this: Document, ev: Event) => any): void;

  /**
   * Creates an element tree to create trees of HTML
   * @opti
   * @param node The html element(s)
   * @example
   * const content = Elements.createTree({
   *   tag: "div",
   *   class: "current-class",
   *   children: [
   *     {
   *       tag: "div",
   *       class: "class-name",
   *       children: [
   *         {
   *           tag: "a",
   *           attrs: {
   *             href: "https://example.com",
   *             target: "_blank",
   *           },
   *           text: "To example.com",
   *         }
   *       ]
   *     }
   *   ]
   * });
   */
  createElements<T extends HTMLElement>(node: ElementNode): T;
}

interface Window {
  /** Width of the browser window */
  readonly width: number;
  /** Height of the browser window */
  readonly height: number;
}

interface Node {
  /** 
   * Gets the parent of the node
   * @opti
   * @returns The parent node
   * @example
   * const el = document.$("#child");
   * const target = el.getParent();
   * 
   * console.log("Target: " + target);
   */
  parent(this: ChildNode): ParentNode | null;

  /**
   * Gets all the children of the node
   * @opti
   * @example
   * const el = document.$("#target").getChildren();
   * 
   * el.forEach((child, i) => console.log("Child " + i + ": " + child));
   */
  getChildren(this: ParentNode): NodeListOf<ChildNode>

  /**
   * Gets the siblings of the node and, if 'inclusive' is true, includes itself in the list
   * @opti
   * @param inclusive If the list should include itself
   * @example
   * const el = document.$("#target").getSiblings(true);
   * 
   * el.forEach((sibling, i) => console.log("Sibling " + i + ": " + sibling));
   */
  siblings(this: ChildNode, inclusive?: boolean): ChildNode[]

  /** 
   * Gets the ancestor of the node by the amount of levels specified
   * @opti
   * @param level The amount of levels to go up
   * @returns The ancestor node
   * @example
   * const el = document("#child");
   * const target = el.getAncestor(3);
   * 
   * console.log("Target: " + target);
   */
  ancestor(this: ChildNode, level: number): ParentNode | null;
  /** 
   * Gets the element's ancestor (ancestor selected is based on the css selector) 
   * @opti
   * @param selector The selector used to get the ancestor
   * @returns The parent element
   */
  ancestor<T extends Element>(this: Element, selector: string): T | null

  /**
   * Finds children based on the selector specified
   * @opti
   * @param selector The css style selector used to find the descendants
   * @example
   * const el = document.$("#parent");
   * el.txt("Parent");
   * 
   * el.$(".hidden").removeClass("hidden");
   */
  $<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
  $<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
  $<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K] | null;
  /** @deprecated */
  $<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): HTMLElementDeprecatedTagNameMap[K] | null;
  $<E extends Element = HTMLElement>(selectors: string): E | null;

  /**
   * Finds children based on the selector specified
   * @opti
   * @param selector The css style selector used to find the descendants
   * @example
   * const el = document.$("#parent");
   * el.txt("Parent");
   * 
   * el.$$(".hidden", true).removeClass("hidden");
   */
  $$<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  $$<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  $$<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
  /** @deprecated */
  $$<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
  $$<E extends Element = HTMLElement>(selectors: string): NodeListOf<E>;
}

interface Element {
  /**
   * Returns a boolean based on whether the elements text contains the text specified or matches the regex provided
   * @opti
   * @param text The text to search for or the regex to match
   * @example
   * const el = document.$("#target");
   * 
   * if (el.containsText("new")) {
   *   el.addClass("new");
   * }
   */
  hasText(text: string | RegExp): boolean;

  /**
   * Adds a class to the element
   * @param elClass The class to add
   * @opti
   * @example
   * const el = document.$("#target");
   * el.addClass("classy")
   */
  addClass(elClass: string): void;

  /**
   * Removes a class from the element
   * @param elClass The class to remove
   * @opti
   * @example
   * const el = document.$("#target");
   * el.removeClass("classy")
   */
  removeClass(elClass: string): void;

  /**
   * Toggles the class on the element
   * @param elClass The class to toggle
   * @opti
   * @example
   * const el = document.$("#target");
   * el.toggleClass("classy")
   */
  toggleClass(elClass: string): void;

  /**
   * Detects whether the element has the class specified
   * @param elClass The class to toggle
   * @opti
   * @example
   * const el = document.$("#target");
   * if (el.hasClass("classy")) {
   *   console.log("It's really classy! (Get it? XD)");
   * }
   */
  hasClass(elClass: string): boolean;

  /**
   * Modifies and/or returns the text of the element
   * @opti
   * @note Putting only "textContent" as a parameter references the previous textContent
   * @example
   * const el = document.$("#target");
   * el.txt("textContent", "Yelp")
   * 
   * console.log(el.txt());
   */
  txt(modifier: (text: string) => string): void;
  txt(newText: string, ...moreText: string[]): void;
  txt(): string;

  /**
   * Gets and sets the elements html
   * @opti
   * @notice use HTMLElement.{@link text} instead if you are not insterting raw html
   * @param input The html to insert in place of the old html
   * @example
   * const el = document.$("target");
   * const html = el.html();
   * 
   * el.html(html + "<a href='example.com'>Link</a>");
   */
  html(input?: string): string;
}

interface HTMLElement {
  /** 
   * Adds inline css to the element. Using the boolean value `true` as the first argument returns the element's computed styles as well
   * @opti
   * @example
   * const el = document.$("#target");
   * 
   * el.css("background-color", "red");
   * el.css({
   *   visibility: "visible",
   *   backgroundColor: "blue"
   * })
   * 
   * console.log(el.css());
   */
  css(key: CSSPropertyName, value: string | number): void;
  css(key: CSSPropertyName): string | number
  css(key: CSSObject): void;
  css(computed: true): CSSObject;
  css(): CSSObject;

  /**
   * Gets the elements tag name
   * @opti
   * @example
   * const el = document.$("#target");
   * 
   * console.log(el.tag()); // Logs tag name
   */
  readonly tag: HTMLTag;

  // /**
  //  * Creates a HTML element animation that animates into the css properties specified
  //  * @opti
  //  * @param styles The css styles to ease into
  //  * @param duration The amount of time the animation should take
  //  * @param easing The easing to apply
  //  * @param finished The function to run when the animation is done
  //  * @example
  //  * document.$("#target").animate({
  //  *   paddingLeft: "+=75px",
  //  *   width: "75%"
  //  * }, 5000, "ease-out", () => console.log("Done!"));
  //  */
  // animate(styles: object, duration: number, easing?: AnimationEasing, finished: () => any): void;

  /**
   * Shows an element
   * @opti
   * @example
   * const el = document.$("#target");
   * el.show();
   */
  show(): void;

  /**
   * Hides an element
   * @opti
   * @param layout If the layout should shift when the element is hidden
   * @example
   * const el = document.$("#target");
   * el.hide(true);
   */
  hide(): void;

  /**
   * Toggles the visibility of a element
   * @opti
   * @param layout If the layout should shift when the element's visibility is changed
   * @example
   * const el = document.$("#target");
   * el.toggle(true);
   */
  toggle(): void;
  toggle(state: boolean): void;

  /**
   * Returns a boolean that represents if the elements visibility, opacity, or display is set to a hidden value
   * @opti
   */
  get isVisible(): boolean;
}

interface HTMLFormElement {
  serialize(): string;
}

interface HTMLInputElement {
  val: ValueAccessor
}

interface NodeList {
  /**
   * Adds a class to the elements
   * @param elClass The class to add
   * @opti
   * @example
   * const el = document.$$("#target");
   * el.addClass("classy")
   */
  addClass(elClass: string): void;

  /**
   * Removes a class from the elements
   * @param elClass The class to remove
   * @opti
   * @example
   * const el = document.$$("#target");
   * el.removeClass("classy")
   */
  removeClass(elClass: string): void;

  /**
   * Toggles the class on the elements
   * @param elClass The class to toggle
   * @opti
   * @example
   * const el = document.$$("#target");
   * el.toggleClass("classy")
   */
  toggleClass(elClass: string): void;
}

interface HTMLCollection {
  /**
   * Adds a class to the elements
   * @param elClass The class to add
   * @opti
   * @example
   * const el = document.$$("#target");
   * el.addClass("classy")
   */
  addClass(elClass: string): void;

  /**
   * Removes a class from the elements
   * @param elClass The class to remove
   * @opti
   * @example
   * const el = document.$$("#target");
   * el.removeClass("classy")
   */
  removeClass(elClass: string): void;

  /**
   * Toggles the class on the elements
   * @param elClass The class to toggle
   * @opti
   * @example
   * const el = document.$$("#target");
   * el.toggleClass("classy")
   */
  toggleClass(elClass: string): void;
}

interface EventTarget {
  /**
   * The events registered on an `EventTarget`
   * @opti
   */
  getEvents<K extends keyof EventMapOf<this>>(event: K): Func[];
}

interface DateConstructor {
  /** 
   * Returns an absolute number of time from January 1, 1970 
   * @opti
   */
  at(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;

  /**
   * Returns a date object by using a time object
   * @opti
   * @param time The time object
   * @param year The year to use
   * @param monthIndex The month to use, by index
   * @param date The date, by number
   * @example
   * const time = new Time();
   * const newDate = Date.fromTime(time, 2025, 4, 28);
   */
  fromTime(this: DateConstructor, time: Time, year: number, monthIndex: number, date?: number): Date;
}

interface Math {
  /** 
   * Returns a pseudorandom number between 0 and max.
   * @opti
   * @param max the maximum random number 
   */
  random(max: number): number
  random(min: number, max: number): number
}

interface ObjectConstructor {
  /**
   * Clones an object
   * @opti
   * @param object The object to clone
   * @param deep Wether the clone should be deep or not
   * @example
   * class Example {
   *   exampleVal = 2;
   *   run() { console.log("Running...") }
   *   static walk() { console.log("Walking...") }
   * }
   * 
   * const oldObj = new Example();
   * const newObj = Object.clone(oldObj);
   *
   * newObj.exampleVal = 4;
   * newObj.run(); // Running...
   * console.log(oldObj.exampleVal); // 2
   */
  clone<T>(object: symbol, deep?: boolean): never;
  clone<T>(object: T, deep?: boolean): T;

  /**
   * Performs the specified action for each element in an array.
   * @opti
   * @param iterator The function that runs on each iteration of the object. Gives the key: value pair for the current value in the object
   * @example
   * Object.forEach({ val1: 1, val2: "Yes" }, ([key, value]) => {
   *  console.log(`Key: ${key}, Value: ${value}`);
   * });
   */
  forEach<T extends object>(object: T, iterator: (key: keyof T, value: T[keyof T]) => any): void;
}

interface Number {
  /**
   * Repeats the iterator the amount of times as the Number
   * @opti
   * @param iterator the function to run on each iteration
   * @example
   * const times = 5;
   * times.repeat(i => {
   *   console.log("Time " + (i + 1));
   * });
   */
  repeat(iterator: (i: number) => void): void;
}

interface Array<T> {
  /**
   * Makes all values in an array unique
   * @opti
   * @example
   * const newArr = [1, 2, 3, 3, 4].unique();
   * console.log(newArr); // [1, 2, 3, 4]
   */
  unique(this: T[]): T[]
  /**
   * Seperates an array into an array of arrays, with each subarray of a defined size
   * @opti
   * @param size The size of the subarrays
   * @examplef
   * const newArr = [1, 2, 3, 3, 4].chunk(2);
   * console.log(newArr); // [[1, 2], [3, 3], [4]]
   */
  chunk(this: T[], size: number): T[][]

  /**
   * Takes a found value out of an array and returns it.
   * @opti
   * @param finder The finder function to find the value to remove
   */
  pluck(finder: (v: T) => boolean): T | null;

  pluckLast(finder: (v: T) => boolean): T | null;

  relocate(index: number, offset: number): number | null

  relocateTo(index: number, location: number): number | null

  /**
   * An array-altering method that inserts item(s) as the specified index
   * @opti
   * @param index The index to insert the item(s) at
   * @param values The values to insert
   * @example
   * const arr = [1, 2, 3, 5];
   * 
   * arr.insert(2, 4); // arr is now [1, 2, 3, 4, 5]
   */
  insert(this: T[], index: number, ...values: T[]): void;
  
  /**
   * Replaces a value in an array and returns the new value
   * @opti
   * @param replaceIndex The index to replace
   * @param finder The function that searches for the right value to replace
   * @param newVal The new value to put in place of the old removed value
   */
  replace(this: T[], replaceIndex: number, newVal: T): T | null;
  replace(this: T[], finder: (val: T) => boolean, newVal: T): T | null;

  /**
   * Replaces the last value in an array and returns the new value
   * @opti
   * @param finder The function that searches for the right value to replace
   * @param newVal The new value to put in place of the old removed value
   */
  replaceLast(this: T[], finder: (val: T) => boolean, newVal: T): T | null;

  /**
   * Sorts an array by a specific type of sorting
   * @opti
   * @param order The order to sort in. Options are `random`, `alpha`, `alpha-reverse`, `increasing`,`decreasing`, `earlier` and `later`
   */
  sort(mode?: SortMode<T>): T[];

  /**
   * Tests the type of values in an array
   * @opti
   * @param type The type of value to check
   */
  get type<T>(): string[];
}

interface String {
  /**
   * Removes text in a string, using a regular expression or search string.
   * @opti
   * @param finder The serching string or regular expression
   * @example 
   * const oldString = "Hello! World!";
   * const newString = oldString.remove("!") // Hello World!
   * const evenNewerString = newString.remove(/\s\w+/) // Hello!
   */
  remove(finder: string | RegExp): string;

  /**
   * Removes the captured text in a string, using a regular expression or search string.
   * @opti
   * @param finder The serching string or regular expression
   * @example 
   * const oldString = "Hello! World!";
   * const newString = oldString.remove(/(!)/) // Hello World
   * const evenNewerString = newString.remove(/(\s)\w+/) // HelloWorld
   */
  removeCaptured(finder: RegExp): string;

  /**
   * Capitalises the first character in a string
   * @opti
   * @example
   * const myString = "hello world";
   * console.log(myString.capitalize()); // "Hello world"
   */
  capitalize(): string;

  /**
   * Finds the first substring match in a regular expression search.
   * @param searcher An object which supports searching within a string.
   */
  matches(regexp: string | RegExp): boolean;

  toCase(format: CaseConventions): string
}

interface Function {
  /**
   * Returns a string array of all of the arguments of the function (named)
   * @opti
   * @example
   * function example(a, b, c) {
   *   return a + b + c;
   * }
   * 
   * console.log(example.getArgs()); /// ["a", "b", "c"]
   */
  getArgs(): string[]
}

interface FunctionConstructor {
  memo<T extends Func>(func: T): T

  debounce<T extends Func>(func: T, ms: number): (this: Func.This<T>, ...args: Func.Arguments<T>) => Future<Func.Return<T>, DebouncedException>

  throttle<T extends Func>(func: T, ms: number): (this: Func.This<T>, ...args: Func.Arguments<T>) => Func.Return<T> | null
}