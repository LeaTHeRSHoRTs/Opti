/**
 * @file opti.lib.d.ts
 * @description Main type declarations for the Opti library
 * @version 1.0.0
 * All definition files use the `@opti` tag to represent things that were added by Opti
 */
/// <reference path="./opti.d.ts" />
/// <reference path="./namespaced.d.ts" />
/// <reference path="./deprecation.d.ts" />
/// <reference path="./alterations.d.ts" />
/// <reference path="./classes.d.ts" />
/// <reference path="./interfaces.d.ts" />

//------------------------------------- Global Functions  -------------------------------------

/** 
 * Creates an iife (Immediately invoked function expression) that triggers on run 
 * @opti
 * @param iife The function to run immediately
 * @param args The arguments to pass to the `iife` function
 * @returns The value returned from the `iife` function
 * @since 1.0.0
 * @example
 * ```ts
 * f(() => {
 *   console.log("I run when the file loads!");
 * });
 * 
 * const res = f(() => {
 *   return "I go into the res variable!";
 * });
 * 
 * const otherRes = f(r => {
 *   return r.insert(1, " don't");
 * }, res);
 * ```
 */
declare function f<T, R, P extends unknown[]>(iife: Func<T, P, R>, args?: P, thisArg?: T): R;

/**
 * Creates a matcher to test values
 * @opti
 * @param val The value who's type is being tested
 * @returns An object that has multiple testing functions and assertions functions
 * @since 1.0.0
 * @example
 * ```ts
 * ```
 */
declare function is<T>(val: T): ValueQueries<T>;

/**
 * Asserts whether `condition` is true or not and throws an {@linkcode AssertionException} if it fails
 * @opti
 * @throws {AssertionException} Throws if the assertion fails
 * @param condition The condition to test
 * @since 1.0.0
 * @example
 * ```ts
 * let mayVar = 32;
 * if (Math.random() > 0.5) {
 *   myVar = 33;
 * }
 * 
 * assert(myVar === 33); // From now on, intellisense thinks that myVar: 33
 * console.log(myVar); // Will not log if myVar is 32 before the assertion
 * ```
 */
declare function assert(condition: boolean): asserts condition;

/**
 * Checks whether the value given is empty, `null`, or `undefined`
 * 
 * @opti
 * @see {@linkcode notEmpty} inverse of `isEmpty`
 * @param val The value to check
 * @since 1.0.0
 * @example
 * ```ts
 * isEmpty(""); // true
 * isEmpty("Hello"); // false
 * isEmpty(NaN); // true
 * isEmpty(0); // false
 * isEmpty({}); // true
 * isEmpty([]); // true
 * isEmpty([1, 2]); // false
 * ```
 */
declare function isEmpty(val: string): val is "";
declare function isEmpty(val: number): boolean;
declare function isEmpty(val: boolean): val is false;
declare function isEmpty(val: null | undefined): true;
declare function isEmpty<T>(val: T[]): val is T[] & { length: 0 };
declare function isEmpty<K extends Key>(val: Record<K, unknown>): val is Record<K, never>;
declare function isEmpty<K extends Key>(val: Map<K, unknown>): val is Map<K, never>;
declare function isEmpty(val: Set<unknown>): val is Set<never>;
declare function isEmpty(val: unknown): boolean;

/**
 * Waits the specified number of ms before returning control to the `then` block, or the main program when using `async` blocks with `await`
 * @opti
 * @throws {NumberTooSmallException} When the returned {@linkcode Future} object fails because `ms` is less than 1
 * @param ms The amount of milliseconds to wait
 * @returns A {@linkcode Future} that resolves to void on success and rejects to a {@linkcode NumberTooSmallException} when the number specified is less than 1
 * @since 1.0.0
 * @example
 * ```ts
 * console.log("I log when the program runs!");
 * 
 * await sleep(500);
 * 
 * console.log("I wait 5 seconds before executing!");
 * ```
 */
declare function sleep(ms: number): Future<void, NumberTooSmallException>;

/**
 * Creates a new type-safe enum full of `string: symbol` pairs. Values in an Enum must follow the variable naming rules of JavaScript, matching `/^[A-Za-z_$][A-Za-z0-9_$]*$/`
 * @opti
 * @throws {SyntaxException} When a property key is not unique or invalid characters are passed
 * @param values The values that will be used for the new enum
 * @returns A new type-safe enum whose properties map the provided strings to symbols, to make the properties unique when checked with `===`
 * @since 1.0.0
 * @example
 * ```ts
 * const Colors = Enum("RED", "ORANGE", "YELLOW", "GREEN", "BLUE")
 * 
 * const color = Colors.ORANGE
 * switch(color) {
 *   case Colors.RED:
 *     console.log("Red")
 *     break;
 *   case Colors.ORANGE:
 *     console.log("Orange")
 *     break;
 *   case Colors.YELLOW:
 *     console.log("Yellow")
 *     break;
 *   case Colors.GREEN:
 *     console.log("Green")
 *     break;
 *   case Colors.BLUE:
 *     console.log("Blue")
 *     break;
 *   default:
 *     console.log("Unknown color")
 *     break;
 * }
 * ```
 */
declare function Enum<const T extends readonly string[]>(...values: T): EnumInstance<T>;

/**
 * Creates a tuple of values from a spread provided. Used for tuple inference where literal arrays are widened to `T[]` instead of inferring a tuple type.
 * @opti
 * @function
 * @param values The values to use for the tuple
 * @returns A new tuple constructed from the values specified
 * @since 1.0.0
 * @example
 * ```ts
 * const myTuple = Tuple("X", 2, true); // Tuple is of type [string, number, boolean]
 * myTuple[0] = 3;         // Type 'number' is not assignable to type 'string'.
 * myTuple[1] = false;     // Type 'boolean' is not assignable to type 'number'.
 * myTuple[2] = "Goodbye"; // Type 'string' is not assignable to type 'boolean'.
 * myTuple[1] = 3;         // Valid
 * ```
 */
declare function Tuple<T extends unknown[]>(...values: T): T;

//-------------------------------------    Exceptions     -------------------------------------

/**
 * Base class for all the Opti Exceptions.
 * 
 * Extends `Error` for compatibility with standard error handing
 * @opti
 * @extends Error
 * @since 1.0.0
 */
declare class Exception {
  constructor(message?: string, cause?: string, name?: string);
  readonly name: string;
  getName(): string;
  getMessage(): string;
  getCause(): string;
  getStackTrace(): string;
  throw(): never;
  toString(): string;
  static isException(val: unknown): val is Exception;
  static isAnyException(val: unknown): val is Exception | RuntimeException;
}

/**
 * Exception that cannot be caught using `instanceof Exception` or `instanceof Error`
 * @opti
 * @extends Object
 * @since 1.0.0
 */
declare var RuntimeException: RuntimeExceptionConstructor;

/**
 * Exception for unimplemented functions, objects, classes, and others
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var NotImplementedException: NotImplementedExceptionConstructor;

/**
 * Exception for unimplemented functions, objects, classes, and others
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var HierarchyException: HierarchyExceptionConstructor;

/**
 * Exception for unknown causes
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var UnknownException: UnknownExceptionConstructor;

/**
 * Exception for illegal access
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var AccessException: AccessExceptionConstructor;

/**
 * Error for assertion related errors
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var AssertionException: AssertionExceptionConstructor;

/**
 * Exception for starting a new debounce
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var DebouncedException: DebouncedExceptionConstructor;

/**
 * Exception for invalid syntax
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var SyntaxException: SyntaxExceptionConstructor;

/**
 * Exception for invalid provided types
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var TypeException: TypeExceptionConstructor;

/**
 * Exception thrown when cloning of objects is invalid
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var CloneException: CloneExceptionConstructor;

/**
 * Exception for all number-related errors
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var NumberException: NumberExceptionConstructor;

/**
 * Exception for when a number is too small
 * @opti
 * @extends NumberException
 * @since 1.0.0
 */
declare var NumberTooSmallException: NumberTooSmallExceptionConstructor;

/**
 * Exception for all decorator-related errors
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var DecoratorException: DecoratorExceptionConstructor;

  /**
   * Exception for all decorator-related errors
   * @opti
   * @extends DecoratorException
   * @since 1.0.0
   */
  declare var IncorrectDecoratorPlacementException: IncorrectDecoratorPlacementExceptionConstructor;

  /**
   * Exception for all `@Abstract` decorator related errors
   * @opti
   * @extends DecoratorException
   * @since 1.0.0
   */
  declare var AbstractException: AbstractExceptionConstructor;

    /**
     * Exception for when `@Abstract` marked classes are attempted to be constructed
     * @opti
     * @extends AbstractException
     * @since 1.0.0
     */
    declare var AbstractInitializationException: AbstractInitializationExceptionConstructor;

    /**
     * Exception for when a `@Abstract` method is attempted to be invoked
     * @opti
     * @extends AbstractException
     * @since 1.0.0
     */
    declare var AbstractMethodInvokedException: AbstractMethodInvokedExceptionConstructor;

/**
 * Exception for when a fetch request fails unexpectedly (not handled in the .catch block of the returned promise)
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var FetchException: FetchExceptionConstructor;

/**
 * Exception for when an invalid action is performed on a registry
 * @opti
 * @extends Exception
 * @since 1.0.0
 */
declare var RegistryException: RegistryExceptionConstructor;

//------------------------------------- Classes & Objects -------------------------------------

/**
 * The `Registry` class contains data that should not be modified or changed, but can be read
 */
declare var Registries: RegistryManifest;

/**
 * The `Future` class is just a promise with a error parameter in TS
 * @is Promise
 * @since 1.0.0
 */
declare var Future: FutureConstructor;

/**
 * The `Opti` object provides information about the `opti` module
 * @property
 */
declare var Opti: Opti;

//-------------------------------------   Augmentations   -------------------------------------

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
  ready(callback: (this: Document, ev: Event) => void): void;

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
  leaving(callback: (this: Document, ev: Event) => void): void;
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
   * Gets the ancestor of the node by the amount of levels specified
   * @opti
   * @param level The amount of levels to go up
   * @returns The ancestor node
   * @example
   * const el = document.$("#child");
   * const text = document.createTextNode("Element Text");
   * const text = el.getAncestor(1);
   */
  ancestor(this: Node, level: number): ParentNode | null;
  /** 
   * Gets the element's ancestor based on a css selector
   * @opti
   * @param selector The selector used to get the ancestor
   * @returns The parent element
   * @example
   * const el = document.$("#child");
   * const target = el.getAncestor("#parent");
   */
  ancestor<T extends Element>(this: Element, selector: string): T | null;

  /**
   * Gets the siblings of the node and, if 'inclusive' is true, includes itself in the list
   * @opti
   * @param inclusive If the list should include itself
   * @example
   * const el = document.$("#target").getSiblings(true);
   * 
   * el.forEach((sibling, i) => console.log("Sibling " + i + ": " + sibling));
   */
  siblings(this: Node, inclusive?: boolean): Node[];
}

interface ParentNode {
  /**
   * Gets all the children of the node
   * @opti
   * @example
   * const el = document.$("#target").getChildren();
   * 
   * el.forEach((child, i) => console.log("Child " + i + ": " + child));
   */
  getChildren(this: ParentNode): NodeListOf<ChildNode>;
}

interface Node {
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
  $$<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementOf<K>[];
  $$<K extends keyof SVGElementTagNameMap>(selectors: K): HTMLElementOf<K>[];
  $$<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementOf<K>[];
  /** @deprecated */
  $$<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): HTMLElementDeprecatedTagNameMap[K][];
  $$<E extends Element = HTMLElement>(selectors: string): E[];

  cut<T extends Node>(this: T): void;
}

interface Element {
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
   * console.log(el.txt()); // Logs "textContent Yelp"
   */
  txt(modifier: (text: string) => string): void;
  txt(newText: string, ...moreText: string[]): void;
  txt(): string;

  /**
   * Gets and sets the elements html
   * @opti
   * @notice use HTMLElement.{@link text} instead if you are not inserting raw html
   * @param input The html to insert in place of the old html
   * @example
   * const el = document.$("target");
   * const html = el.html();
   * 
   * el.html(html + "<a href='example.com'>Link</a>");
   */
  html(input: string): void;
  html(): string;

  copy<T extends Element>(this: T, children?: boolean, events?: boolean): T;
  copy<T extends Element>(this: T, options: Element.CopyOptions): T;

  /**
   * Gets and sets the attributes of an element
   * @opti
   * @param key The attribute to get or set
   * @example
   * const element = document.$("#target");
   * const id = element.attr('id');
   * element.attr('href', "https://example.org");
   */
  attr<K extends keyof this>(this: Element, key: K): this[K];
  attr<K extends keyof this>(this: Element, key: K, value: this[K]): void;
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
  css(key: CSS.PropertyName, value: string | number | null): void;
  css(key: CSS.PropertyName): string | number | null;
  css(key: string): string | number | null;
  css(key: CSS.Object): void;
  css(): CSS.Object;

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
  readonly isVisible: boolean;
}

interface HTMLFormElement {
  serialize(): string;
}

interface HTMLInputElement {
  val: HTMLInputElement.ValueAccessor;
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
  randomRange(max: number): number;
  randomRange(min: number, max: number): number;
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
  forEach<T extends object>(object: T, iterator: (key: keyof T, value: T[keyof T]) => void): void;
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
  unique(this: T[]): T[];
  /**
   * Separates an array into an array of arrays, with each subarray of a defined size
   * @opti
   * @param size The size of the sub-arrays
   * @example
   * const newArr = [1, 2, 3, 3, 4].chunk(2);
   * console.log(newArr); // [[1, 2], [3, 3], [4]]
   */
  chunk(this: T[], size: number): T[][];

  /**
   * Takes a found value out of an array and returns it.
   * @opti
   * @param finder The finder function to find the value to remove
   */
  pluck(finder: (v: T) => boolean): T | null;

  pluckLast(finder: (v: T) => boolean): T | null;

  /**
   * Relocates an item in an array by a set amount
   * @param index The item to move
   * @param offset The offset to move it by
   * @returns The new location of the item
   */
  relocate(index: number, offset: number): number | null;

  relocateTo(index: number, location: number): number | null;

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
   * Sorts an array by a specific type of sorting
   * @opti
   * @param order The order to sort in. Options are `random`, `alpha`, `alpha-reverse`, `increasing`,`decreasing`, `earlier` and `later`
   */
  sort(mode: SortMode<T>): T[];
  sort(compareFn?: (a: T, b: T) => number): this;
}

interface String {
  /**
   * Removes text in a string, using a regular expression or search string.
   * @opti
   * @param finder The searching string or regular expression
   * @example 
   * const oldString = "Hello! World!";
   * const newString = oldString.remove("!") // Hello World!
   * const evenNewerString = newString.remove(/\s\w+/) // Hello!
   */
  remove(finder: string | RegExp): string;

  /**
   * Removes the captured text in a string, using a regular expression or search string.
   * @opti
   * @param finder The searching string or regular expression
   * @example 
   * const oldString = "Hello! World!";
   * const newString = oldString.remove(/(!)/) // Hello World
   * const evenNewerString = newString.remove(/(\s)\w+/) // HelloWorld
   */
  removeCaptured(finder: RegExp): string;

  /**
   * Capitalizes the first character in a string
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

  toCase(format: String.Case): string;
}

interface FunctionConstructor {
  /**
   * Returns a function with a memorized return value. The memorized return value is based on the inputs given in `args`
   * @opti
   * @param func The function to use to create the new function
   * @param args The arguments to use to calculate and memorize the output
   */
  memo<T, A extends unknown[], R>(func: Func<T, A, R>): Func<T, A, R>;

  /**
   * Returns a debounced version of the provided function
   * @opti
   * @param func The function to use to create the debounced function
   * @param ms The debounce time, in milliseconds
   */
  debounce<T, A extends unknown[], R>(func: Func<T, A, R>, ms: number): Func<T, A, Future<R, DebouncedException>>;

  /**
   * Returns a throttled version of the provided function
   * @opti
   * @param func The function to use to create the throttled function
   * @param ms The throttle time, in milliseconds
   */
  throttle<T, A extends unknown[], R>(func: Func<T, A, R>, ms: number): Func<T, A, R | null>;
}