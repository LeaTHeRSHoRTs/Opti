// eslint-disable-next-line jsdoc/require-tags
/**
 * @file opti.lib.d.ts
 * @description Main type declarations for the Opti library
 * @version 1.0.0
 * All definition files use the `@opti` tag to represent things that were added by Opti
 */
import './types.js';
import './deprecation.js';
import './namespaces.js';
import './alterations.js';
import './classes.js';
import './interfaces.js';

declare global {
    //------------------------------------- Global Functions  -------------------------------------

    /** 
     * Creates an iife (Immediately invoked function expression) that triggers on run 
     * @opti
     * @since 1.0.0
     * @param iife The function to run immediately
     * @param args The arguments to pass to the `iife` function
     * @param thisArg The value used for the `this` context of the function
     * @returns The value returned from the `iife` function
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
    function f<T, R, P extends unknown[]>(iife: Func<T, P, R>, args?: P, thisArg?: T): R;

    /**
     * Creates a matcher to test values
     * @opti
     * @since 1.0.0
     * @param val The value who's type is being tested
     * @returns An object that has multiple testing functions and assertions functions
     * @example
     * ```ts
     * ```
     */
    function is<T>(val: T): ValueQueries<T>;

    /**
     * Asserts whether `condition` is true or not and throws an {@linkcode AssertionError} if it fails
     * @opti
     * @since 1.0.0
     * @param condition The condition to test
     * @throws {AssertionError} Throws if the assertion fails
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
    function assert(condition: boolean): asserts condition;

    /**
     * Checks whether the value given is empty, `null`, or `undefined`
     * 
     * @opti
     * @since 1.0.0
     * @param val The value to check
     * @returns A boolean value that represents whether the value is empty or not
     * @see {@linkcode notEmpty} inverse of `isEmpty`
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
    function isEmpty(val: string): val is '';
    function isEmpty(val: number): boolean;
    function isEmpty(val: boolean): val is false;
    function isEmpty(val: null | undefined): true;
    function isEmpty<T>(val: T[]): val is T[] & { length: 0 };
    function isEmpty<K extends Key>(val: Record<K, unknown>): val is Record<K, never>;
    function isEmpty<K extends Key>(val: Map<K, unknown>): val is Map<K, never>;
    function isEmpty(val: Set<unknown>): val is Set<never>;
    function isEmpty(val: unknown): boolean;

    /**
     * Waits the specified number of ms before returning control to the `then` block, or the main program when using `async` blocks with `await`
     * @opti
     * @since 1.0.0
     * @param ms The amount of milliseconds to wait
     * @returns A {@linkcode Future} resolving to `void`, or rejecting with {@linkcode NumberTooSmallError} if the number is less than 1.
     * @throws {NumberTooSmallError} When the returned {@linkcode Future} object fails because `ms` is less than 1
     * @example
     * ```ts
     * console.log("I log when the program runs!");
     * 
     * await sleep(500);
     * 
     * console.log("I wait 5 seconds before executing!");
     * ```
     */
    function sleep(ms: number): Future<void, NumberTooSmallError>;

    /**
     * Creates a new type-safe enum full of `string: symbol` pairs. Values in an Enum must follow the variable naming rules of JavaScript, matching `/^[A-Za-z_$][A-Za-z0-9_$]*$/`
     * @opti
     * @since 1.0.0
     * @param values The values that will be used for the new enum
     * @returns A new type-safe enum whose properties map the provided strings to symbols, to make the properties unique when checked with `===`
     * @throws {SyntaxError} When a property key is not unique or invalid characters are passed
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
    function Enum<const T extends readonly string[]>(...values: T): EnumInstance<T>;

    /**
     * Creates a tuple of values from a spread provided. Used for tuple inference where literal arrays are widened to `T[]` instead of inferring a tuple type.
     * @opti
     * @since 1.0.0
     * @param values The values to use for the tuple
     * @returns A new tuple constructed from the values specified
     * @example
     * ```ts
     * const myTuple = Tuple("X", 2, true); // Tuple is of type [string, number, boolean]
     * myTuple[0] = 3;         // Type 'number' is not assignable to type 'string'.
     * myTuple[1] = false;     // Type 'boolean' is not assignable to type 'number'.
     * myTuple[2] = "Goodbye"; // Type 'string' is not assignable to type 'boolean'.
     * myTuple[1] = 3;         // Valid
     * ```
     */
    function Tuple<T extends unknown[]>(...values: T): T;

    //-------------------------------------    Errors     -------------------------------------

    /**
     * Error that cannot be caught using `instanceof Error`
     * @opti
     * @since 1.0.0
     * @extends Object
     */
    var RuntimeError: RuntimeErrorConstructor;

    /**
     * Error for unimplemented functions, objects, classes, and others
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var NotImplementedError: NotImplementedErrorConstructor;

    /**
     * Error for unimplemented functions, objects, classes, and others
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var HierarchyError: HierarchyErrorConstructor;

    /**
     * Error for unknown causes
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var UnknownError: UnknownErrorConstructor;

    /**
     * Error for illegal access
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var AccessError: AccessErrorConstructor;

    /**
     * Error for assertion related errors
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var AssertionError: AssertionErrorConstructor;

    /**
     * Error for starting a new debounce
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var DebouncedError: DebouncedErrorConstructor;

    /**
     * Error thrown when cloning of objects is invalid
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var CloneError: CloneErrorConstructor;

    /**
     * Error for all number-related errors
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var NumberError: NumberErrorConstructor;

    /**
     * Error for when a number is too small
     * @opti
     * @since 1.0.0
     * @extends NumberError
     */
    var NumberTooSmallError: NumberTooSmallErrorConstructor;

    /**
     * Error for when a fetch request fails unexpectedly (not handled in the .catch block of the returned promise)
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var FetchError: FetchErrorConstructor;

    /**
     * Error for when an invalid action is performed on a registry
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var RegistryError: RegistryErrorConstructor;

    //------------------------------ Classes, Objects, and Variables -------------------------------

    /**
     * The `Registry` class contains data that should not be modified or changed, but can be read
     * @opti
     * @since 1.0.0
     */
    var Registries: RegistryManifest;

    /**
     * The `Future` class is just a promise with a error parameter in TS
     * @opti
     * @since 1.0.0
     * @extends Promise
     */
    var Future: FutureConstructor;

    /**
     * The `Opti` object provides information about the `opti` module
     * @opti
     * @since 1.0.0
     */
    var Opti: Opti;

    /**
     * A placeholder value that can be used anywhere, but cannot be used at runtime. Usually for use when developing website or web apps
     * @opti
     * @since 1.0.0
     * @throws {NotImplementedError} When used to signify that it has no application
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var placeholder: any;

    //-------------------------------------   Augmentations   -------------------------------------

    interface Document {
        /** 
         * Gets the styles defined in the document's styles for the element specified by the css selector
         * @opti
         * @since 1.0.0
         * @param selector The css selector used to fetch the styles from the stylesheet
         * @example
         * document.css("#target", {
         *   backgroundColor: "red",
         *   color: "grey"
         * })
         */
        css(selector: keyof HTMLElementTagNameMap): Partial<Record<keyof CSSStyleDeclaration, string>>;

        /** 
         * Assigns a css object to a specified css selector for all elements matching it
         * @opti
         * @since 1.0.0
         * @param selector The css selector used for the specified styles
         * @param styles A style object for the css selector specified by `selector`
         * @example
         * document.css("#target", {
         *   backgroundColor: "red",
         *   color: "grey"
         * })
         */
        css(selector: keyof HTMLElementTagNameMap, styles: Partial<Record<keyof CSSStyleDeclaration, string | number>>): void;

        /** 
         * Assigns a css object to a specified css selector for all elements matching it
         * @opti
         * @since 1.0.0
         * @param selector The css selector used for the specified styles
         * @example
         * document.css("#target", {
         *   backgroundColor: "red",
         *   color: "grey"
         * })
         */
        css(
            selector: string
        ): Partial<Record<keyof CSSStyleDeclaration, string>>;

        /** 
         * Assigns a css object to a specified css selector for all elements matching it
         * @opti
         * @since 1.0.0
         * @param selector The css selector used for the specified styles
         * @param styles A style object for the css selector specified by `selector`
         * @example
         * document.css("#target", {
         *   backgroundColor: "red",
         *   color: "grey"
         * })
         */
        css(
            selector: string,
            styles: Partial<Record<keyof CSSStyleDeclaration, string | number>>
        ): void;

        /**
         * Calls the callback when the document is ready and all of the content is loaded
         * @opti
         * @since 1.0.0
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
         * @since 1.0.0
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
         * @since 1.0.0
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
         * @since 1.0.0
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
         * @since 1.0.0
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
         * @since 1.0.0
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
         * @since 1.0.0
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
         * @since 1.0.0
         * @param selector The css style selector used to find the descendants
         * @example
         * const el = document.$("#parent");
         * el.txt("Parent");
         * 
         * el.$(".hidden").removeClass("hidden");
         */
        $<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
        $<K extends keyof SVGElementTagNameMap>(selector: K): SVGElementTagNameMap[K] | null;
        $<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K] | null;
        // eslint-disable-next-line jsdoc/require-tags
        /** @deprecated */
        $<K extends keyof HTMLElementDeprecatedTagNameMap>(selector: K): HTMLElementDeprecatedTagNameMap[K] | null;
        $<E extends Element = HTMLElement>(selector: string): E | null;

        /**
         * Finds children based on the selector specified
         * @opti
         * @since 1.0.0
         * @param selector The css style selector used to find the descendants
         * @example
         * const el = document.$("#parent");
         * el.txt("Parent");
         * 
         * el.$$(".hidden", true).removeClass("hidden");
         */
        $$<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementOf<K>[];
        $$<K extends keyof SVGElementTagNameMap>(selector: K): HTMLElementOf<K>[];
        $$<K extends keyof MathMLElementTagNameMap>(selector: K): MathMLElementOf<K>[];
        // eslint-disable-next-line jsdoc/require-tags
        /** @deprecated */
        $$<K extends keyof HTMLElementDeprecatedTagNameMap>(selector: K): HTMLElementDeprecatedTagNameMap[K][];
        $$<E extends Element = HTMLElement>(selector: string): E[];

        cut<T extends Node>(this: T): void;
    }

    interface Element {
        /**
         * Adds a class to the element
         * @opti
         * @since 1.0.0
         * @param elClass The class to add
         * @example
         * const el = document.$("#target");
         * el.addClass("classy")
         */
        addClass(elClass: string): void;

        /**
         * Removes a class from the element
         * @opti
         * @since 1.0.0
         * @param elClass The class to remove
         * @example
         * const el = document.$("#target");
         * el.removeClass("classy")
         */
        removeClass(elClass: string): void;

        /**
         * Toggles the class on the element
         * @opti
         * @since 1.0.0
         * @param elClass The class to toggle
         * @example
         * const el = document.$("#target");
         * el.toggleClass("classy")
         */
        toggleClass(elClass: string): void;

        /**
         * Detects whether the element has the class specified
         * @opti
         * @since 1.0.0
         * @param elClass The class to toggle
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
         * @since 1.0.0
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
         * @since 1.0.0
         * @param input The html to insert in place of the old html
         * @throws {UnnecessaryError} When the context would be inserted exactly like text
         * @example
         * const el = document.$("target");
         * const html = el.html();
         * 
         * el.html(html + "<a href='example.com'>Link</a>");
         * @notice use HTMLElement.{@link text} instead if you are not inserting raw html
         */
        html(input: string): void;
        html(): string;

        copy<T extends Element>(this: T, children?: boolean, events?: boolean): T;
        copy<T extends Element>(this: T, options: ElementCopyOptions): T;

        /**
         * Gets the specified attribute from an element
         * @opti
         * @since 1.0.0
         * @param key The attribute to get or set
         * @example
         * const element = document.$("#target");
         * const id = element.attr('id');
         * element.attr('href', "https://example.org");
         */
        attr<K extends keyof this>(key: K): this[K];

        /**
         * Gets the specified attribute from an element
         * @opti
         * @since 1.0.0
         * @param key The attribute to get or set
         * @param value The value to set the attribute to. Use null to clear the attribute
         * @example
         * const element = document.$("#target");
         * const id = element.attr('id');
         * element.attr('href', "https://example.org");
         */
        attr<K extends keyof this>(key: K, value: this[K] | null): void;
    }

    interface HTMLElement {
        /** 
         * Adds inline css to the element.
         * @opti
         * @since 1.0.0
         * @param key The CSS property to modify
         * @param value The value to set this key to. Use null to erase the value
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

        /** 
         * Adds inline css to the element.
         * @opti
         * @since 1.0.0
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
        css(key: CSS.PropertyName): string | number | null;

        /** 
         * Adds inline css to the element.
         * @opti
         * @since 1.0.0
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
        css(key: string): string | number | null;

        /** 
         * Adds inline css to the element.
         * @opti
         * @since 1.0.0
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
        css(key: CSS.Object): void;

        /** 
         * Adds inline css to the element.
         * @opti
         * @since 1.0.0
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
        css(): CSS.Object;

        /**
         * Gets the elements tag name
         * @opti
         * @since 1.0.0
         * @example
         * const el = document.$("#target");
         * 
         * console.log(el.tag()); // Logs tag name
         */
        readonly tag: HTMLTag;

        /**
         * Shows an element
         * @opti
         * @since 1.0.0
         * @example
         * const el = document.$("#target");
         * el.show();
         */
        show(): void;

        /**
         * Hides an element
         * @opti
         * @since 1.0.0
         * @example
         * const el = document.$("#target");
         * el.hide(true);
         */
        hide(): void;

        /**
         * Toggles the visibility of a element
         * @opti
         * @since 1.0.0
         * @example
         * const el = document.$("#target");
         * el.toggle(true);
         */
        toggle(): void;
        toggle(state: boolean): void;

        /**
         * Returns a boolean that is true if the element is visible to the user
         * @opti
         * @since 1.0.0
         */
        readonly isVisible: boolean;
    }

    interface HTMLFormElement {
        /**
         * Serializes a form and its elements into a string
         * @opti
         * @since 1.0.0
         */
        serialize(): string;
    }

    interface HTMLInputElement {
        /**
         * Provides better interfacing with the value of an input element
         * @opti
         * @since 1.0.0
         */
        val: HTMLInputElement.ValueAccessor;
    }

    interface NodeList {
        /**
         * Adds a class to the elements
         * @opti
         * @since 1.0.0
         * @param elClass The class to add
         * @example
         * const el = document.$$("#target");
         * el.addClass("classy")
         */
        addClass(elClass: string): void;

        /**
         * Removes a class from the elements
         * @opti
         * @since 1.0.0
         * @param elClass The class to remove
         * @example
         * const el = document.$$("#target");
         * el.removeClass("classy")
         */
        removeClass(elClass: string): void;

        /**
         * Toggles the class on the elements
         * @opti
         * @since 1.0.0
         * @param elClass The class to toggle
         * @example
         * const el = document.$$("#target");
         * el.toggleClass("classy")
         */
        toggleClass(elClass: string): void;
    }

    interface HTMLCollection {
        /**
         * Adds a class to the elements
         * @opti
         * @since 1.0.0
         * @param elClass The class to add
         * @example
         * const el = document.$$("#target");
         * el.addClass("classy")
         */
        addClass(elClass: string): void;

        /**
         * Removes a class from the elements
         * @opti
         * @since 1.0.0
         * @param elClass The class to remove
         * @example
         * const el = document.$$("#target");
         * el.removeClass("classy")
         */
        removeClass(elClass: string): void;

        /**
         * Toggles the class on the elements
         * @opti
         * @since 1.0.0
         * @param elClass The class to toggle
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
         * @since 1.0.0
         * @param year The year to use
         * @param monthIndex The month index to use
         * @param date The date of the mont to use
         * @param hours The hour to use
         * @param minutes The minute to use
         * @param seconds The second to use
         * @param ms The millisecond to use
         */
        at(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;
    }

    interface Math {
        /** 
         * Returns a pseudorandom number between 0 and max.
         * @opti
         * @since 1.0.0
         * @param max the maximum random number
         */
        randomRange(max: number): number;
        randomRange(min: number, max: number): number;
    }

    interface ObjectConstructor {
        /**
         * Clones an object
         * @opti
         * @since 1.0.0
         * @param object The object to clone
         * @param deep Whether the clone should be deep or not
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
         * @since 1.0.0
         * @param object The object to iterate over
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
         * @since 1.0.0
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
         * @since 1.0.0
         * @example
         * const newArr = [1, 2, 3, 3, 4].unique();
         * console.log(newArr); // [1, 2, 3, 4]
         */
        unique(this: T[]): T[];
        /**
         * Separates an array into an array of arrays, with each subarray of a defined size
         * @opti
         * @since 1.0.0
         * @param size The size of the sub-arrays
         * @example
         * const newArr = [1, 2, 3, 3, 4].chunk(2);
         * console.log(newArr); // [[1, 2], [3, 3], [4]]
         */
        chunk(this: T[], size: number): T[][];

        /**
         * Takes a found value out of an array and returns it.
         * @opti
         * @since 1.0.0
         * @param finder The finder function to find the value to remove
         * @param index The index used to find and 
         */
        pluck(index: number): T | null;
        pluck(finder: (v: T) => boolean): T | null;

        /**
         * 
         * @opti
         * @since 1.0.0
         * @param finder The finder function used to find and pluck the value from the array
         */
        pluckLast(finder: (v: T) => boolean): T | null;

        /**
         * Relocates an item in an array by a set amount
         * @opti
         * @since 1.0.0
         * @param index The item to move
         * @param offset The offset to move it by
         * @returns The new location of the item
         */
        relocate(index: number, offset: number): number | null;

        relocateTo(index: number, location: number): number | null;

        /**
         * An array-altering method that inserts item(s) as the specified index
         * @opti
         * @since 1.0.0
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
         * @since 1.0.0
         * @param replaceIndex The index to replace
         * @param newVal The new value to put in place of the old removed value
         */
        replace(this: T[], replaceIndex: number, newVal: T): T | null;

        /**
         * Replaces a value in an array and returns the new value
         * @opti
         * @since 1.0.0
         * @param finder The function that searches for the right value to replace
         * @param newVal The new value to put in place of the old removed value
         */
        replace(this: T[], finder: (val: T) => boolean, newVal: T): T | null;

        /**
         * Sorts an array by a specific type of sorting
         * @opti
         * @since 1.0.0
         * @param mode The order to sort in. Options are `random`, `alpha`, `alpha-reverse`, `increasing`,`decreasing`, `earlier` and `later`
         */
        sort(mode: SortMode<T>): T[];
        sort(compareFn?: (a: T, b: T) => number): this;
    }

    interface String {
        /**
         * Removes text in a string, using a regular expression or search string.
         * @opti
         * @since 1.0.0
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
         * @since 1.0.0
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
         * @since 1.0.0
         * @example
         * const myString = "hello world";
         * console.log(myString.capitalize()); // "Hello world"
         */
        capitalize(): string;

        /**
         * Finds the first substring match in a regular expression search.
         * @opti
         * @since 1.0.0
         * @param regexp A string or regular expression used to search through the string
         * @returns A boolean value representing whether the string matches the value specified in `regexp`
         */
        matches(regexp: string | RegExp): boolean;

        /**
         * Converts a string to a certain casing. The supported casings are specified in the `Str.Case` type
         * @opti
         * @since 1.0.0
         * @param format The string format to use, selected from the `Str.Case` type
         */
        toCase(format: Str.Case): string;
    }

    interface FunctionConstructor {
        /**
         * Returns a function with a memorized return value. The memorized return value is based on the inputs given in `args`
         * @opti
         * @since 1.0.0
         * @param func The function to use to create the new function
         * //param args The arguments to use to calculate and memorize the output
         */
        memo<T, A extends unknown[], R>(func: Func<T, A, R>): Func<T, A, R>;

        /**
         * Returns a debounced version of the provided function
         * @opti
         * @since 1.0.0
         * @param func The function to use to create the debounced function
         * @param ms The debounce time, in milliseconds
         */
        debounce<T, A extends unknown[], R>(func: Func<T, A, R>, ms: number): Func<T, A, Future<R, DebouncedError>>;

        /**
         * Returns a throttled version of the provided function
         * @opti
         * @since 1.0.0
         * @param func The function to use to create the throttled function
         * @param ms The throttle time, in milliseconds
         */
        throttle<T, A extends unknown[], R>(func: Func<T, A, R>, ms: number): Func<T, A, R | null>;
    }
}