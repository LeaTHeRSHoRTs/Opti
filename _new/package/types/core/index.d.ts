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
     * f(() => console.log("I run when the file loads!"));
     * 
     * const res = f(() => "I go into the res variable!");
     * const otherRes = f(r => r.insert(1, " don't"), res); // I don't go into the res variable!
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
    function is<T>(val: T): Is<T>;

    // eslint-disable-next-line jsdoc/require-returns
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
     * @returns A {@linkcode Future} that resolves to `void` after the timeout specified by `ms`
     * @throws {RangeError} When the `ms` parameter is 0 or less
     * @example
     * ```ts
     * console.log("I log when the program runs!");
     * 
     * await sleep(500);
     * 
     * console.log("I wait 5 seconds before executing!");
     * ```
     */
    function sleep(ms: number): Future<void>;

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

    /**
     * Error for when an unnecessary operation happens
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var UnnecessaryError: UnnecessaryErrorConstructor;

    /**
     * Error for invalid selectors
     * @opti
     * @since 1.0.0
     * @extends SyntaxError
     */
    var InvalidSelectorError: InvalidSelectorErrorConstructor;

    /**
     * Error for use of floating point numbers
     * @opti
     * @since 1.0.0
     * @extends SyntaxError
     */
    var FloatingNumberError: FloatingNumberErrorConstructor;

    /**
     * Error for when a duplicate ID would be present
     * @opti
     * @since 1.0.0
     * @extends Error
     */
    var DuplicateIDError: DuplicateIDErrorConstructor;

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
         * @returns A CSS object with only the properties actually defined on the element
         * @throws {SyntaxError} When the selector has invalid syntax
         * @example
         * document.css("#target", {
         *   backgroundColor: "red",
         *   color: "grey"
         * })
         */
        css(selector: keyof HTMLElementTagNameMap): CSS.Object;

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
        css(selector: keyof HTMLElementTagNameMap, styles: CSS.Object): void;

        /** 
         * Assigns a css object to a specified css selector for all elements matching it
         * @opti
         * @since 1.0.0
         * @param selector The css selector used for the specified styles
         * @returns A CSS object with only the properties actually defined on the element
         * @example
         * document.css("#target", {
         *   backgroundColor: "red",
         *   color: "grey"
         * })
         */
        css(selector: string): CSS.Object;

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
        css(selector: string, styles: CSS.Object): void;

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
        ancestor<T extends Element>(selector: string): T | null;

        /**
         * Gets the siblings of the node and, if 'inclusive' is true, includes itself in the list
         * @opti
         * @since 1.0.0
         * @param inclusive If the returned list should include itself
         * @returns An array of nodes containing all the siblings of the element, including itself if `inclusive` is set to true
         * @example
         * const el = document.$("#target").getSiblings(true);
         * 
         * el.forEach((sibling, i) => console.log("Sibling " + i + ": " + sibling));
         */
        siblings(this: Node, inclusive?: boolean): Arr<Node>;

        /**
         * Gets all the children of the node
         * @opti
         * @since 1.0.0
         * @returns The children of the node
         * @example
         * const el = document.$("#target").getChildren();
         * 
         * el.forEach((child, i) => console.log("Child " + i + ": " + child));
         */
        getChildren(): Arr<ChildNode>;
    }

    interface Node {
        /**
         * Finds children based on the selector specified
         * @opti
         * @since 1.0.0
         * @param selector The css style selector used to find the descendants
         * @returns The selected element, or null if no element matches the selector
         * @throws {InvalidSelectorError} When the CSS selector is invalid
         * @example
         * const el = document.$("#parent");
         * el.txt("Parent");
         * 
         * el.$(".hidden").removeClass("hidden");
         */
        $<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
        /* eslint-disable jsdoc/require-jsdoc, jsdoc/require-tags, jsdoc/require-param, jsdoc/require-example,jsdoc/require-returns */
        $<K extends keyof SVGElementTagNameMap>(selector: K): SVGElementTagNameMap[K] | null;
        $<K extends keyof MathMLElementTagNameMap>(selector: K): MathMLElementTagNameMap[K] | null;
        /** @deprecated */
        $<K extends keyof HTMLElementDeprecatedTagNameMap>(selector: K): HTMLElementDeprecatedTagNameMap[K] | null;
        $<E extends Element = HTMLElement>(selector: string): E | null;
        /* eslint-enable jsdoc/require-jsdoc, jsdoc/require-tags, jsdoc/require-param, jsdoc/require-example, jsdoc/require-returns */

        /**
         * Finds children based on the selector specified
         * @opti
         * @since 1.0.0
         * @param selector The css style selector used to find the descendants
         * @returns An array of matching elements, or null if there were no matched elements
         * @throws {InvalidSelectorError} When the CSS selector is invalid
         * @example
         * const el = document.$("#parent");
         * el.txt("Parent");
         * 
         * el.$$(".hidden", true).removeClass("hidden");
         */
        $$<K extends keyof HTMLElementTagNameMap>(selector: K): Arr<HTMLElementOf<K>>;
        /* eslint-disable jsdoc/require-jsdoc, jsdoc/require-tags, jsdoc/require-param, jsdoc/require-example, jsdoc/require-returns */
        $$<K extends keyof SVGElementTagNameMap>(selector: K): Arr<HTMLElementOf<K>>;
        $$<K extends keyof MathMLElementTagNameMap>(selector: K): Arr<MathMLElementOf<K>>;
        /** @deprecated */
        $$<K extends keyof HTMLElementDeprecatedTagNameMap>(selector: K): Arr<HTMLElementDeprecatedTagNameMap[K]>;
        $$<E extends Element = HTMLElement>(selector: string): Arr<E>;
        /* eslint-enable jsdoc/require-jsdoc, jsdoc/require-tags, jsdoc/require-param, jsdoc/require-example, jsdoc/require-returns */
    }

    interface Element {
        /**
         * Adds a class to the element
         * @opti
         * @since 1.0.0
         * @param classes The classes to add
         * @example
         * const el = document.$("#target");
         * el.addClass("classy")
         */
        addClass(...classes: Arr.Present<string>): void;

        /**
         * Removes a class from the element
         * @opti
         * @since 1.0.0
         * @param classes The classes to remove
         * @example
         * const el = document.$("#target");
         * el.removeClass("classy")
         */
        removeClass(...classes: Arr.Present<string>): void;

        /**
         * Toggles the class on the element
         * @opti
         * @since 1.0.0
         * @param classes The classes to toggle
         * @returns A boolean value representing whether the class is on the element after toggling
         * @example
         * const el = document.$("#target");
         * el.toggleClass("classy")
         */
        toggleClass(...classes: Arr.Present<string>): boolean;

        /**
         * Detects whether the element has the class specified
         * @opti
         * @since 1.0.0
         * @param elClass The class to toggle
         * @returns A boolean value representing whether the class is on the element
         * @example
         * const el = document.$("#target");
         * if (el.hasClass("classy")) {
         *   console.log("It's really classy! (Get it? XD)");
         * }
         */
        hasClass(elClass: string): boolean;

        /**
         * Modifies the text in the element using a function that gives the original text content
         * @opti
         * @since 1.0.0
         * @param modifier The function used to modify the text and return the new text
         * @example
         * const el = document.$("#target");
         * el.txt(origin => origin + " Bar");
         */
        txt(modifier: (text: string) => string): void;

        /**
         * Modifies the text in the element
         * @opti
         * @since 1.0.0
         * @param newText The text to be inserted into the element as a replacement to the old text
         * @example
         * const el = document.$("#target");
         * el.txt("Foo", "Bar");
         */
        txt(...newText: Arr.Present<string>): void;

        /**
         * Returns the text of the element
         * @opti
         * @since 1.0.0
         * @returns The current text content of the element
         * @example
         * const el = document.$("#target");
         * console.log(el.txt());
         */
        txt(): string;

        /**
         * Gets and sets the elements html. Use HTMLElement.{@link text} instead if you are not inserting raw html
         * @opti
         * @since 1.0.0
         * @param input The html to insert in place of the old html
         * @example
         * const el = document.$("target");
         * const html = el.html();
         * 
         * el.html(html + "<a href='example.com'>Link</a>");
         */
        html(input: string): void;

        /**
         * Gets and sets the elements html. Use HTMLElement.{@link text} instead if you just want text content
         * @opti
         * @since 1.0.0
         * @returns The raw HTML content of the element
         * @example
         * const el = document.$("target");
         * const html = el.html();
         * 
         * el.html(html + "<a href='example.com'>Link</a>");
         * @notice use HTMLElement.{@link text} instead if you are not inserting raw html
         */
        html(): string;

        /**
         * Copies an element, with optional children and event copying
         * @opti
         * @since 1.0.0
         * @param children Whether the children should be copied
         * @param events Whether the events should be copied
         * @returns A copy of the element
         * @throws {DuplicateIDError} When the original element has an ID that will be copied over to the new element
         * @example
         * const element = document.$("#target");
         * const copy = target.copy(true, false);
         * document.body.append(copy);
         */
        copy<T extends Element>(this: T, children?: boolean, events?: boolean): T;

        /**
         * Copies an element, with optional children and event copying
         * @opti
         * @since 1.0.0
         * @param options An object representing the things to copy off of the element
         * @returns A copy of the element
         * @throws {DuplicateIDError} When the original element has an ID that will be 
         * copied over to the new element, and a `fallbackID` is not set
         * @example
         * const element = document.$("#target");
         * const copy = target.copy({
         *   copyAttributes: true
         * });
         * document.body.append(copy);
         */
        copy<T extends Element>(this: T, options: ElementCopyOptions): T;

        /**
         * Gets the specified attribute from an element
         * @opti
         * @since 1.0.0
         * @param key The attribute to get or set
         * @returns The attribute specified by `key`
         * @example
         * const element = document.$("#target");
         * const id = element.attr('id');
         * console.log(id);
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
         * Returns a CSS property from the element as specified by `key`
         * @opti
         * @since 1.0.0
         * @param key The CSS key to use to fetch the property, in camelCase
         * @returns The value of the CSS property specified by `key`
         * @example
         * const el = document.$("#target");
         * console.log(el.css('backgroundColor'));
         */
        css(key: CSS.PropertyName): string | number | null;

        /** 
         * Returns a CSS property from the element as specified by `key`
         * @opti
         * @since 1.0.0
         * @param key The CSS key to use to fetch the property, in camelCase
         * @returns The value of the CSS property specified by `key`
         * @example
         * const el = document.$("#target");
         * console.log(el.css('backgroundColor'));
         */
        css(key: string): string | number | null;

        /** 
         * Sets the CSS of the element using an object
         * @opti
         * @since 1.0.0
         * @param object The object to use to set the properties, with the keys in camelCase
         * @example
         * const el = document.$("#target");
         * el.css({
         *   backgroundColor: 'cyan',
         *   borderRadius: '10px'
         * });
         */
        css(object: CSS.Object): void;

        /** 
         * Returns all the CSS on the element in a `CSS.Object`
         * @opti
         * @since 1.0.0
         * @returns A CSS object with all of the styles that have been modified inline
         * @example
         * const el = document.$("#target");
         * console.log(el.css());
         */
        css(): CSS.Object;

        /**
         * Gets the element's tag name
         * @opti
         * @since 1.0.0
         * @example
         * const el = document.$("#target");
         * 
         * console.log(el.tag); // Logs tag name
         */
        readonly tag: HTMLTag;

        /**
         * Shows an element on the page, using CSS styles
         * @opti
         * @since 1.0.0
         * @example
         * const el = document.$("#target");
         * el.show();
         */
        show(): void;

        /**
         * Hides an element on the page, using CSS styles
         * @opti
         * @since 1.0.0
         * @example
         * const el = document.$("#target");
         * el.hide(true);
         */
        hide(): void;

        /**
         * Toggles the visibility of a element on the page, using CSS styles
         * @opti
         * @since 1.0.0
         * @example
         * const el = document.$("#target");
         * el.toggle();
         */
        toggle(): void;

        /**
         * Returns a boolean that is true if the element is visible on the page
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
         * @returns A serialized string of all of the form data
         * @example
         * const form = document.$("#target");
         * const serialized = form.serialize();
         * console.log(serialized);
         */
        serialize(): string;
    }

    interface HTMLInputElement {
        /**
         * Provides better interfacing with the value of an input element
         * @opti
         * @since 1.0.0
         */
        val: InputValueAccessor;
    }

    interface NodeList {
        /**
         * Adds a class to all the elements in the list
         * @opti
         * @since 1.0.0
         * @param elClass The class to add
         * @example
         * const el = document.$$("#target");
         * el.addClass("classy")
         */
        addClass(elClass: string): void;

        /**
         * Removes a class from all the elements in the list
         * @opti
         * @since 1.0.0
         * @param elClass The class to remove
         * @example
         * const el = document.$$("#target");
         * el.removeClass("classy")
         */
        removeClass(elClass: string): void;

        /**
         * Toggles the specified class on all the elements in the list
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
         * Adds a class to all the elements in the list
         * @opti
         * @since 1.0.0
         * @param elClass The class to add
         * @example
         * const el = document.$$("#target");
         * el.addClass("classy")
         */
        addClass(elClass: string): void;

        /**
         * Removes a class from all the elements in the list
         * @opti
         * @since 1.0.0
         * @param elClass The class to remove
         * @example
         * const el = document.$$("#target");
         * el.removeClass("classy")
         */
        removeClass(elClass: string): void;

        /**
         * Toggles the specified class on all the elements in the list
         * @opti
         * @since 1.0.0
         * @param elClass The class to toggle
         * @example
         * const el = document.$$("#target");
         * el.toggleClass("classy")
         */
        toggleClass(elClass: string): void;
    }

    interface Math {
        /** 
         * Returns a pseudorandom number between 0 and `max`, inclusively.
         * @opti
         * @since 1.0.0
         * @param max the maximum for the random number
         * @returns A random number between 0 and `max`
         * @example
         * const rand = Math.randomRange(3);
         * console.log(rand);
         */
        randomRange(max: number): number;

        /** 
         * Returns a pseudorandom number between `min` and `max`, inclusively.
         * @opti
         * @since 1.0.0
         * @param min The minimum for the random number
         * @param max the maximum for the random number
         * @returns A random number between 0 and `max`, including the two boundaries
         * @example
         * const rand = Math.randomRange(3);
         * console.log(rand);
         */
        randomRange(min: number, max: number): number;


        /**
         * Returns a pseudorandom whole number between 0 and `max`, inclusively.
         * @opti
         * @since 1.0.0
         * @param max The maximum integer for the random number
         * @returns A random whole number between 0 and `max`, including the two boundaries
         * @throws {FloatingNumberError} When `max` is not a whole number
         * @example
         * const rand = Math.randomIntRange(5);
         * console.log(rand);
         */
        randomIntRange(max: number): number;

        /**
         * Returns a pseudorandom whole number between 0 and `max`, inclusively.
         * @opti
         * @since 1.0.0
         * @param min The minimum integer for the random number
         * @param max The maximum integer for the random number
         * @returns A random whole number between 0 and `max`, including the two boundaries
         * @throws {FloatingNumberError} When `min` or `max` is not a whole number
         * @example
         * const rand = Math.randomIntRange(5);
         * console.log(rand);
         */
        randomIntRange(min: number, max: number): number;
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
         * @returns An array with perfectly unique values that do not repeat
         * @example
         * const newArr = [1, 2, 2, 2, 2, 3, 3, 3, 4, 4,].unique();
         * console.log(newArr); // [1, 2, 3, 4]
         */
        unique(): T[];
        /**
         * Separates an array into an array of arrays, with each subarray of a defined size
         * @opti
         * @since 1.0.0
         * @param size The size of the sub-arrays
         * @returns A chunked array
         * @throws {RangeError} When the number specified is 0 or less
         * @throws {RangeError} When the number specified exceed's the array's length
         * @example
         * const newArr = [1, 2, 3, 3, 4].chunk(2);
         * console.log(newArr); // [[1, 2], [3, 3], [4]]
         */
        chunk(size: number): T[][];

        /**
         * Finds an item in an array and takes it out of the array by index
         * @opti
         * @since 1.0.0
         * @param index The index used to find the element
         * @returns The element if it is found, or null
         * @throws {RangeError} When the number specified is 0 or less
         * @throws {RangeError} When the number specified exceed's the array's length
         * @example
         * const arr = [1, 2, 3, 4, 5, 6, 7, 8];
         * const plucked = arr.pluck(3);
         * console.log(plucked); // 4
         * console.log(arr); // [1, 2, 3, 5, 6, 7, 8]
         */
        pluck(index: number): T | null;

        /**
         * Finds an item in an array and takes it out of the array using a finder function
         * @opti
         * @since 1.0.0
         * @param finder The finder function to find the value to remove
         * @returns The element if it is found, or null
         * @example
         * const arr = ["one", "two", "three", "four", "five"];
         * const plucked = arr.pluck(val => val.includes('r'));
         * console.log(plucked); // three
         * console.log(arr); // ["one", "two", "four", "five"]
         */
        pluck(finder: (v: T) => boolean): T | null;

        /**
         * Finds the last item in an array that matches the finder function and takes it out and returns it
         * @opti
         * @since 1.0.0
         * @param finder The finder function used to find and pluck the value from the array
         * @returns The last item in the array that matches the finder function
         * @example
         * const arr = ["one", "two", "three", "four", "five"];
         * const plucked = arr.pluckLast(val => val.includes('r'));
         * console.log(plucked); // four
         * console.log(arr); // ["one", "two", "three", "five"]
         */
        pluckLast(finder: (v: T) => boolean): T | null;

        /**
         * Relocates an item in an array to an offset position as specified by `offset`
         * @opti
         * @since 1.0.0
         * @param from The item to move
         * @param offset The offset to move it by
         * @returns The new location of the item
         * @example
         * const arr =  ["one", "two", "five", "four", "three"];
         * const itemIndex = arr.relocate(4, -2);
         * console.log(itemIndex); // 
         * console.log(arr); ["one", "two", "three", "four", "five"]
         */
        relocate(from: number, offset: number): number | null;

        /**
         * Relocates an item in an array to a new position in the array
         * @opti
         * @since 1.0.0
         * @param from The item to move
         * @param to The new location to put the item
         * @returns The new location of the item
         * @example
         * const arr =  ["one", "two", "five", "four", "three"];
         * const itemIndex = arr.relocateTo(4, 2);
         * console.log(itemIndex); // 
         * console.log(arr); ["one", "two", "three", "four", "five"]
         */
        relocateTo(from: number, to: number): number | null;

        /**
         * An array-altering method that inserts item(s) as the specified index
         * @opti
         * @since 1.0.0
         * @param index The index to insert the item(s) at
         * @param values The values to insert
         * @example
         * const arr = [1, 2, 3, 5];
         * arr.insert(2, 4);
         * console.log(arr); // [1, 2, 3, 4, 5]
         */
        insert(this: T[], index: number, ...values: T[]): void;

        /**
         * Replaces a value in an array and returns the new value
         * @opti
         * @since 1.0.0
         * @param replaceIndex The index to replace
         * @param newVal The new value to put in place of the old removed value
         * @returns The value that was replaced, or null if no value was replaced
         * @example
         * const arr =  ["one", "two", "three", "four", "three"];
         * const itemIndex = arr.replace(4, "five");
         * console.log(itemIndex); // 
         * console.log(arr); ["one", "two", "three", "four", "five"]
         */
        replace(this: T[], replaceIndex: number, newVal: T): T | null;

        /**
         * Replaces a value in an array and returns the new value
         * @opti
         * @since 1.0.0
         * @param finder The function that searches for the right value to replace
         * @param newVal The new value to put in place of the old removed value
         * @returns The value that was replaced, or null if no value was replaced
         * @example
         * const arr = [1, 2, 3, 4, 100, 6, 7];
         * const replaced = arr.replace(v => v === 100, 5);
         * console.log(replaced); // 100
         * console.log(arr); [1, 2, 3, 4, 5, 6, 7]
         */
        replace(finder: (val: T) => boolean, newVal: T): T | null;

        /**
         * Sorts an array by a specific type of sorting
         * @opti
         * @since 1.0.0
         * @param mode The order to sort in. Options are `random`, `alpha`, `alpha-reverse`, `increasing`,`decreasing`, `earlier` and `later`
         * @returns A sorted array based on the parameter `mode`
         * @example
         * const arr = ["x", "y", "ab", "af", "ac", "z"];
         * const sortedArr = arr.sortBy('alphanumeric')
         * console.log(sortedArr); // ["ab", "ac", "af", "x", "y", "z"]
         */
        sortBy(mode: Arr.SortMode<T>): T[];

        /**
         * Converts an array to a type-safe {@linkcode Arr}.
         * @opti
         * @since 1.0.0
         * @returns A non-empty array, or `null` if empty.
         * @example
         * const numberArray = [1, 2, 3];
         * const numberArr = numberArray.asArr();
         */
        asArr(): Arr.Safe<this>;
    }

    interface String {
        /**
         * Removes text in a string, using a regular expression or search string.
         * @opti
         * @since 1.0.0
         * @param finder The searching string or regular expression
         * @returns A new string without the removed substring
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
         * @param regex The searching string or regular expression
         * @returns A new string without the removed substring that was captured using the regex
         * @example 
         * const oldString = "Hello! World!";
         * const newString = oldString.remove(/(!)/) // Hello World
         * const evenNewerString = newString.remove(/(\s)\w+/) // HelloWorld
         */
        removeCaptured(regex: RegExp): string;

        /**
         * Capitalizes the first character in a string
         * @opti
         * @since 1.0.0
         * @param allCapitalized Whether all of the words should be capitalized, or just the first. 
         * Defaults to `false`
         * @returns A string with the letters capitalized
         * @example
         * const myString = "hello world";
         * console.log(myString.capitalize()); // "Hello world"
         * const mySecondString = "goodbye world";
         * console.log(mySecondString.capitalize(true)); // Goodbye World
         */
        capitalize(allCapitalized?: boolean): string;

        /**
         * Finds the first substring match in a regular expression search.
         * @opti
         * @since 1.0.0
         * @param regexpOrString A string or regular expression used to search through the string
         * @returns A boolean value representing whether the string matches the value specified in `regexp`
         * @example
         * const str = "My String";
         * if (str.contains("My")) {
         *   console.log("This string contains the substring 'My;")
         * } else if (str.contains(/\w$/)) {
         *   console.log("This string matches the regex '\\w$'")
         * }
         */
        contains(regexpOrString: string | RegExp): boolean;

        /**
         * Converts a string to a certain casing. The supported casings are specified in the `Str.Case` type
         * @opti
         * @since 1.0.0
         * @param format The string format to use, selected from the `Str.Case` type
         * @returns A string that has been transformed to the casing specified by `format`
         * @example
         * const str = "my string";
         * const camelString = str.toCase('camel');
         * const kebabString = str.toCase('kebab');
         * const pascalString = str.toCase('pascal');
         * const dotString = str.toCase('dot');
         * 
         * console.log(camelString);  // myString
         * console.log(kebabString);  // my-string
         * console.log(pascalString); // MyString
         * console.log(dotString);    // my.string
         */
        toCase(format: Str.Case): string;
    }

    // Constructors
    interface FunctionConstructor {
        /**
         * Returns a function that caches the result of `func` every time it is called
         * with arguments that have not been cached before
         * @opti
         * @since 1.0.0
         * @param func The function whose result is to be cached
         * @returns A function that caches all the results of every call it makes
         * @example
         * function formula(multiplier) {
         *   return (multiplier * (multiplier + 1)) / 2;
         * }
         * 
         * const formulaMemo = Function.memo(formula);
         * console.log(formulaMemo(2));  // Output: 3
         * console.log(formulaMemo(6));  // Output: 21
         * console.log(formulaMemo(2));  // Output: 3  (Faster because it was memorized before)
         * console.log(formulaMemo(6));  // Output: 21 (Faster because it was memorized before)
         * console.log(formulaMemo(14)); // Output: 105
         */
        memo<T extends Func>(func: T): T;

        /**
         * Returns a debounced version of the provided function
         * @opti
         * @since 1.0.0
         * @param func The function to debounce
         * @param ms The debounce delay, in milliseconds
         * @returns A function that returns a {@linkcode Future} resolving to the result of `func`, or rejecting with a {@linkcode DebouncedError} if the call is superseded by another call before the delay expires
         * @example
         * const saveInput = (text: string) => `Saved: ${text}`;
         * const debouncedSave = debounce(saveInput, 300);
         * const call1 = debouncedSave("apple"); 
         * 
         * await sleep(200);
         * 
         * // Because it happened 200ms after the first call, first function is suspended
         * const call2 = debouncedSave("banana");
         * 
         * call1.catch(err => console.log(err.message)); // Output: "DebouncedError: Superseded"
         * call2.then(res => console.log(res));          // Output: "Saved: banana" (after 300ms)
         */
        debounce<T, A extends unknown[], R>(func: Func<T, A, R>, ms: number): Func<T, A, Future<R, DebouncedError>>;

        /**
         * Returns a throttled version of the provided function
         * @opti
         * @since 1.0.0
         * @param func The function to use to create the throttled function
         * @param ms The minimum interval between calls, in milliseconds
         * @returns A function that returns the result of `func` when a call is executed, or `null` when the call is suppressed by the throttle interval
         * @example
         * const logClick = (id: number) => `Clicked ${id}`;
         * const throttledClick = throttle(logClick, 1000);
         * 
         * console.log(throttledClick(1)); // "Clicked 1" (Executed immediately)
         * console.log(throttledClick(1)); // null        (Suppressed, 1000ms hasn't passed)
         * 
         * await sleep(1050);
         * console.log(throttledClick(1)); // "Clicked 1" (Executed after 1000ms delay)
         */
        throttle<T, A extends unknown[], R>(func: Func<T, A, R>, ms: number): Func<T, A, R | null>;
    }

    interface ObjectConstructor {
        /**
         * Clones an object
         * @opti
         * @since 1.0.0
         * @param object The object to clone
         * @param deep Whether the clone should be deep or not
         * @returns A duplication of the object
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
        clone<T>(object: T, deep?: boolean): T;

        /**
         * Clones an object
         * @opti
         * @since 1.0.0
         * @param object The object to clone
         * @param deep Whether the clone should be deep or not
         * @throws {CloneError} When the object specified is a symbol
         * @example
         * const symbol = Symbol("Example");
         * const newSymbol = Object.clone(symbol); // Throws a CloneError
         */
        clone(object: symbol, deep?: boolean): never;

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
         * @returns A number representing the amount of milliseconds between the specified date and January 1, 1970
         * @example
         * const dayInMs = Date.now()
         * const dateInFuture = Date.at(2035, 6, 4);
         * console.log(
         *   dayInMs + " compared to " + dateInFuture + '.', 
         *   "Gap between the two: " + (dateInFuture - dayInMs)
         * );
         */
        at(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;
    }
}