(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Opti"] = factory();
	else
		root["Opti"] = factory();
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// ./src/classes.ts
/** @potential */
class Time {
    constructor(hours, minutes, seconds, milliseconds) {
        if (hours instanceof Date) {
            this.hours = hours.getHours();
            this.minutes = hours.getMinutes();
            this.seconds = hours.getSeconds();
            this.milliseconds = hours.getMilliseconds();
        }
        else {
            const now = new Date();
            this.hours = hours !== null && hours !== void 0 ? hours : now.getHours();
            this.minutes = minutes !== null && minutes !== void 0 ? minutes : now.getMinutes();
            this.seconds = seconds !== null && seconds !== void 0 ? seconds : now.getSeconds();
            this.milliseconds = milliseconds !== null && milliseconds !== void 0 ? milliseconds : now.getMilliseconds();
        }
        this.validateTime();
    }
    // Validation for time properties
    validateTime() {
        if (this.hours < 0 || this.hours >= 24)
            throw new globalThis.SyntaxException("Hours must be between 0 and 23.");
        if (this.minutes < 0 || this.minutes >= 60)
            throw new globalThis.SyntaxException("Minutes must be between 0 and 59.");
        if (this.seconds < 0 || this.seconds >= 60)
            throw new globalThis.SyntaxException("Seconds must be between 0 and 59.");
        if (this.milliseconds < 0 || this.milliseconds >= 1000)
            throw new globalThis.SyntaxException("Milliseconds must be between 0 and 999.");
    }
    static of(date) {
        return new this(date);
    }
    // Getters
    getHours() { return this.hours; }
    getMinutes() { return this.minutes; }
    getSeconds() { return this.seconds; }
    getMilliseconds() { return this.milliseconds; }
    // Setters
    setHours(hours) {
        this.hours = hours;
        this.validateTime();
    }
    setMinutes(minutes) {
        this.minutes = minutes;
        this.validateTime();
    }
    setSeconds(seconds) {
        this.seconds = seconds;
        this.validateTime();
    }
    setMilliseconds(milliseconds) {
        this.milliseconds = milliseconds;
        this.validateTime();
    }
    // Returns the time in milliseconds since the start of the day
    getTime() {
        return (this.hours * 3600000 +
            this.minutes * 60000 +
            this.seconds * 1000 +
            this.milliseconds);
    }
    // Returns the time in milliseconds since the start of the day
    static at(hours, minutes, seconds, milliseconds) {
        return new Time(hours, minutes, seconds, milliseconds).getTime();
    }
    sync() {
        return new Time();
    }
    // Static: Return current time as a Time object
    static now() {
        return new Time().getTime();
    }
    toString() {
        return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
        // removed by dead control flow

    }
    toISOString() {
        return `T${this.toString()}.${this.milliseconds.toString().padStart(3, '0')}Z`;
    }
    toJSON() {
        return this.toISOString(); // Leverage the existing toISOString() method
    }
    toDate(years, months, days) {
        return new Date(years, months, days, this.hours, this.minutes, this.seconds, this.milliseconds);
    }
    static fromDate(date) {
        return new Time(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }
    // Arithmetic operations
    addMilliseconds(ms) {
        const totalMilliseconds = this.getTime() + ms;
        return Time.fromMilliseconds(totalMilliseconds);
    }
    subtractMilliseconds(ms) {
        const totalMilliseconds = this.getTime() - ms;
        return Time.fromMilliseconds(totalMilliseconds);
    }
    addSeconds(seconds) {
        return this.addMilliseconds(seconds * 1000);
    }
    addMinutes(minutes) {
        return this.addMilliseconds(minutes * 60000);
    }
    addHours(hours) {
        return this.addMilliseconds(hours * 3600000);
    }
    // Static: Create a Time object from total milliseconds
    static fromMilliseconds(ms) {
        const hours = Math.floor(ms / 3600000) % 24;
        const minutes = Math.floor(ms / 60000) % 60;
        const seconds = Math.floor(ms / 1000) % 60;
        const milliseconds = ms % 1000;
        return new Time(hours, minutes, seconds, milliseconds);
    }
    // Parsing
    static fromString(timeString) {
        var _a, _b;
        const match = timeString.match(/^(\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{3}))?$/);
        if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const seconds = parseInt((_a = match[3]) !== null && _a !== void 0 ? _a : "0", 10);
            const milliseconds = parseInt((_b = match[4]) !== null && _b !== void 0 ? _b : "0", 10);
            return new Time(hours, minutes, seconds, milliseconds);
        }
        throw new globalThis.SyntaxException("Invalid time string format.");
    }
    static fromISOString(isoString) {
        const match = isoString.match(/T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z/);
        if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const seconds = parseInt(match[3], 10);
            const milliseconds = parseInt(match[4], 10);
            return new Time(hours, minutes, seconds, milliseconds);
        }
        throw new globalThis.SyntaxException("Invalid ISO string format.");
    }
    // Comparison
    compare(other) {
        const currentTime = this.getTime();
        const otherTime = other.getTime();
        if (currentTime < otherTime) {
            return -1;
        }
        else if (currentTime > otherTime) {
            return 1;
        }
        else {
            return 0;
        }
    }
    isBefore(other) {
        return this.compare(other) === -1;
    }
    isAfter(other) {
        return this.compare(other) === 1;
    }
    equals(other) {
        return this.compare(other) === 0;
    }
    static equals(first, other) {
        return first.compare(other) === 0;
    }
}
function Tuple(...values) {
    return values;
}
function Enum(...values) {
    const obj = {};
    values.forEach((val) => {
        const key = String(val);
        if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) {
            throw new SyntaxException("Enum values must be defined and may only be the characters A-Z, a-z, 0-9, _ and $");
        }
        else if (Object.prototype.hasOwnProperty.call(obj, key)) {
            throw new SyntaxException("Enum members may only be unique");
        }
        Object.defineProperty(obj, key, {
            value: Symbol(key),
            enumerable: true,
            configurable: false,
            writable: false,
        });
    });
    // Add iterator
    Object.defineProperty(obj, Symbol.iterator, {
        enumerable: false,
        value: function* () {
            for (const val of values) {
                yield val;
            }
        },
    });
    return obj;
}
class Collection {
    constructor(items) {
        this.items = items !== null && items !== void 0 ? items : [];
    }
    get length() {
        return this.items.length;
    }
    static from(arrayLike) {
        return new Collection(Array.from(arrayLike));
    }
    static of(...values) {
        return new Collection(values);
    }
    /**
     * @throws {CollectionOutOfBoundsException} The index does not exist
     */
    item(index) {
        const item = this.items[index];
        if (!item)
            throw new CollectionOutOfBoundsException("index " + index + " does not exist on this collection");
        return this.items[index];
    }
    each(callback, thisArg) {
        this.items.forEach(callback, thisArg);
    }
    *[Symbol.iterator]() {
        yield* this.items;
    }
    *entries() {
        yield* this.items.entries();
    }
    *keys() {
        yield* this.items.keys();
    }
    *values() {
        yield* this.items.values();
    }
    toArray() {
        return this.items;
    }
    toReadonlyArray() {
        return this.items;
    }
}

;// ./src/document.ts
function ready(callback) {
    document.addEventListener("DOMContentLoaded", callback);
}
function leaving(callback) {
    document.addEventListener("beforeunload", (e) => callback.call(document, e));
}
// export function bindShortcut (
//   shortcut: Shortcut,
//   callback: (event: ShortcutEvent) => void
// ): void {
//   document.addEventListener('keydown', (event: Event) => {
//     const keyboardEvent = event as ShortcutEvent;
//     keyboardEvent.keys = shortcut.split("+") as [KeyboardEventKey, KeyboardEventKey, KeyboardEventKey?, KeyboardEventKey?, KeyboardEventKey?];
//     const keys = shortcut
//       .trim()
//       .toLowerCase()
//       .split("+");
//     // Separate out the modifier keys and the actual key
//     const modifiers = keys.slice(0, -1);
//     const finalKey = keys[keys.length - 1];
//     const modifierMatch = modifiers.every((key: any) => {
//       if (key === 'ctrl' || key === 'control') return keyboardEvent.ctrlKey;
//       if (key === 'alt') return keyboardEvent.altKey;
//       if (key === 'shift') return keyboardEvent.shiftKey;
//       if (key === 'meta' || key === 'windows' || key === 'command') return keyboardEvent.metaKey;
//       return false;
//     });
//     // Check that the pressed key matches the final key
//     const keyMatch = finalKey === keyboardEvent.key.toLowerCase();
//     if (modifierMatch && keyMatch) {
//       callback(keyboardEvent);
//     }
//   });
// }
function documentCss(element, object) {
    const selector = element.trim();
    if (!selector) {
        throw new globalThis.SyntaxException("Selector cannot be empty.");
    }
    //@ts-ignore
    let styleTag = document.querySelector("style[js-styles]");
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.setAttribute("js-styles", "");
        document.head.appendChild(styleTag);
    }
    const sheet = styleTag.sheet;
    let ruleIndex = -1;
    const existingStyles = {};
    for (let i = 0; i < sheet.cssRules.length; i++) {
        const rule = sheet.cssRules[i];
        if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
            ruleIndex = i;
            const declarations = rule.style;
            for (let j = 0; j < declarations.length; j++) {
                const name = declarations[j];
                existingStyles[name] = declarations.getPropertyValue(name).trim();
            }
            break;
        }
    }
    if (!object || Object.keys(object).length === 0) {
        return existingStyles;
    }
    // Convert camelCase to kebab-case
    const newStyles = {};
    for (const [prop, val] of Object.entries(object)) {
        if (val !== null && val !== undefined) {
            const kebab = prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
            newStyles[kebab] = val.toString();
        }
    }
    const mergedStyles = Object.assign(Object.assign({}, existingStyles), newStyles);
    const styleString = Object.entries(mergedStyles)
        .map(([prop, val]) => `${prop}: ${val};`)
        .join(" ");
    if (ruleIndex !== -1) {
        sheet.deleteRule(ruleIndex);
    }
    try {
        sheet.insertRule(`${selector} { ${styleString} }`, sheet.cssRules.length);
    }
    catch (err) {
        console.error("Failed to insert CSS rule:", err, { selector, styleString });
    }
}
function createElements(node) {
    const el = document.createElement(node.tag);
    // Add class if provided
    if (node.class)
        el.className = node.class;
    // Add text content if provided
    if (node.text)
        el.textContent = node.text;
    // Add inner HTML if provided
    if (node.html)
        el.innerHTML = node.html;
    // Handle styles, ensure it’s an object
    if (node.style && typeof node.style === 'object') {
        for (const [prop, val] of Object.entries(node.style)) {
            el.style.setProperty(prop, val.toString());
        }
    }
    // Handle other attributes (excluding known keys)
    for (const [key, val] of Object.entries(node)) {
        if (key !== 'tag' &&
            key !== 'class' &&
            key !== 'text' &&
            key !== 'html' &&
            key !== 'style' &&
            key !== 'children') {
            if (typeof val === 'string') {
                el.setAttribute(key, val);
            }
            else
                throw new globalThis.TypeException("Custom parameters must be of type 'string'");
        }
    }
    // Handle children (ensure it's an array or a single child)
    if (node.children) {
        if (Array.isArray(node.children)) {
            node.children.forEach(child => {
                el.appendChild(createElements(child));
            });
        }
        else {
            el.appendChild(createElements(node.children)); // Support for a single child node
        }
    }
    return el;
}
function $(selector) {
    return document.querySelector(selector);
}
;
function $$(selector) {
    return document.querySelectorAll(selector);
}
;

;// ./src/elements.ts
function hasText(text) {
    if (typeof text === "string") {
        return this.txt().includes(text);
    }
    else {
        return text.test(this.txt());
    }
}
function addClass(elClass) {
    this.classList.add(elClass);
}
function removeClass(elClass) {
    this.classList.remove(elClass);
}
function toggleClass(elClass) {
    this.classList.toggle(elClass);
}
function hasClass(elClass) {
    return this.classList.contains(elClass);
}
function parseUnit(unit) {
    if (/^0[^.]?/.test(unit))
        return 0;
    if (!isNaN(Number(unit)))
        return Number(unit);
    return unit;
}
function dashToCamel(str) {
    return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
// camelCase ("backgroundColor") → dash-case ("background-color")
function camelToDash(str) {
    return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}
function css(key, value) {
    const css = this.style;
    if (!key || key === true) {
        // Return all styles
        const result = {};
        for (let i = 0; i < css.length; i++) {
            const prop = css[i];
            if (!prop)
                continue;
            const camelProp = dashToCamel(prop);
            const style = css.getPropertyValue(prop).trim();
            result[camelProp] = parseUnit(style);
        }
        if (key === true) {
            const computed = getComputedStyle(this);
            const computedObj = {};
            for (let i = 0; i < computed.length; i++) {
                const prop = computed[i];
                if (!prop)
                    continue;
                const camelProp = dashToCamel(prop);
                const style = computed.getPropertyValue(prop).trim();
                computedObj[camelProp] = parseUnit(style);
            }
            return Object.assign(Object.assign({}, result), computedObj);
        }
        return result;
    }
    if (typeof key === "string") {
        if (value === undefined) {
            return parseUnit(css.getPropertyValue(camelToDash(key)).trim());
        }
        else {
            // Set one value
            if (key in css) {
                css.setProperty(camelToDash(key), value.toString());
            }
        }
    }
    else {
        // Set multiple
        for (const [prop, val] of Object.entries(key)) {
            if (val !== null && val !== undefined) {
                css.setProperty(camelToDash(prop), val.toString());
            }
        }
    }
}
;
function getParent() {
    return this.parentElement;
}
;
function getAncestor(arg) {
    // Case 1: numeric level
    if (typeof arg === "number") {
        let node = this;
        for (let i = 0; i < arg; i++) {
            if (!(node === null || node === void 0 ? void 0 : node.parentNode))
                return null;
            node = node.parentNode;
        }
        return node;
    }
    // Case 2: selector string
    const selector = arg;
    let el = this instanceof Element ? this : this.parentElement;
    while (el) {
        if (el.matches(selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}
function html(input) {
    return input !== undefined ? (this.innerHTML = input) : this.innerHTML;
}
;
function elements_text(text, ...input) {
    var _a, _b, _c;
    // If text is provided, update the textContent
    if (text !== undefined) {
        if (typeof text === "string") {
            input.unshift(text); // Add the text parameter to the beginning of the input array
            const joined = input.join(" "); // Join all the strings with a space
            // Replace "textContent" if it's found in the joined string (optional logic)
            this.textContent = joined.includes("textContent")
                ? joined.replace("textContent", (_a = this.textContent) !== null && _a !== void 0 ? _a : "")
                : joined;
        }
        else {
            this.textContent = text((_b = this.textContent) !== null && _b !== void 0 ? _b : "");
        }
    }
    // Return the current textContent if no arguments are passed
    return (_c = this.textContent) !== null && _c !== void 0 ? _c : "";
}
;
function show() {
    this.css("visibility", "visible");
}
;
function hide() {
    this.css("visibility", "hidden");
}
;
function toggle() {
    if (this.css("visibility") === "visible" || this.css("visibility") === "") {
        this.hide();
    }
    else {
        this.show();
    }
}
;
function elements_$(selector) {
    if (selector.includes(","))
        throw new MalformedQueryException("Invalid query: commas are not allowed in query selectors that can only select 1 element");
    return this.querySelector(selector); // Returns a single Element or null
}
;
function elements_$$(selector) {
    return this.querySelectorAll(selector); // Returns a single Element or null
}
;
function getChildren() {
    return this.childNodes;
}
;
function getSiblings(inclusive) {
    const siblings = Array.from(this.parentNode.childNodes);
    if (inclusive) {
        return siblings; // Include current node as part of siblings
    }
    else {
        return siblings.filter(node => !node.isSameNode(this));
    }
}
;
function serialize() {
    const formData = new FormData(this); // Create a FormData object from the form
    // Create an array to hold key-value pairs
    const entries = [];
    // Use FormData's forEach method to collect form data
    formData.forEach((value, key) => {
        entries.push([key, value.toString()]);
    });
    // Convert the entries into a query string
    return entries
        .map(([key, value]) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
        .join('&'); // Join the array into a single string, separated by '&'
}
;
function cut() {
    const clone = document.createElementNS(this.namespaceURI, this.tagName);
    // Copy all attributes
    for (const attr of Array.from(this.attributes)) {
        clone.setAttribute(attr.name, attr.value);
    }
    // Deep copy child nodes (preserves text, elements, etc.)
    for (const child of Array.from(this.childNodes)) {
        clone.appendChild(child.cloneNode(true));
    }
    // Optionally copy inline styles (not always needed if using setAttribute above)
    if (this instanceof HTMLElement && clone instanceof HTMLElement) {
        clone.style.cssText = this.style.cssText;
    }
    this.remove(); // Remove original from DOM
    return clone;
}
function isVisible() {
    return this.css("visibility") !== "hidden"
        ? this.css("display") !== "none"
        : Number(this.css("opacity")) > 0;
}
function as(type) {
    const value = this.value.trim();
    switch (type) {
        case "string":
            return value;
        case "number":
            const num = Number(value);
            return !isNaN(num) && value !== "" ? num : null;
        case "boolean":
            if (value.toLowerCase() === "true")
                return true;
            if (value.toLowerCase() === "false")
                return false;
        case "date":
            const date = new Date(value);
            if (!isNaN(date.getTime()))
                return date;
        default:
            return null;
    }
}
function parseTime(value) {
    const [h, m, s] = value.split(":");
    const [sec, ms] = (s !== null && s !== void 0 ? s : "0").split(".");
    const date = new Date();
    date.setHours(+h, +m, +sec, +ms || 0);
    return date;
}
function val() {
    const self = this;
    return {
        asBoolean() {
            switch (self.type) {
                case "checkbox":
                case "radio":
                    return self.checked;
                // Other input types: only return boolean if value itself is explicitly "true" or "false"
                default:
                    if (self.value === "true")
                        return true;
                    if (self.value === "false")
                        return false;
                    // For anything else (text, number, etc.), it doesn’t represent a boolean meaningfully
                    return null;
            }
        },
        asNumber() {
            const num = self.valueAsNumber;
            return Number.isNaN(num) ? null : num;
        },
        asDate() {
            let date = self.valueAsDate;
            if (!date && self.type === "time")
                date = parseTime(self.value);
            return date;
        },
        asString() {
            var _a;
            return (_a = self.value) !== null && _a !== void 0 ? _a : "";
        }
    };
}
;

;// ./src/exception.ts
class exception_Exception extends Error {
    constructor(message, cause) {
        var _a;
        super();
        this._name = "Exception";
        this._message = message !== null && message !== void 0 ? message : "";
        this._cause = cause !== null && cause !== void 0 ? cause : "";
        this._internalStack = (_a = new Error().stack) !== null && _a !== void 0 ? _a : "";
    }
    get name() {
        return this._name;
    }
    getMessage() {
        return this._message;
    }
    getCause() {
        return this._cause;
    }
    throw() {
        throw this;
    }
    getStackTrace() {
        return this._internalStack;
    }
    toString() {
        return `${this._name}: ${this._message}\r\n${this._internalStack}`;
    }
}
class RuntimeException {
    constructor(message = "", cause = "") {
        this._message = message;
        this._cause = cause;
    }
    get name() {
        return "RuntimeException";
    }
    getMessage() {
        return this._message;
    }
    getCause() {
        return this._cause;
    }
    toString() {
        return `RuntimeException: ${this._message}`;
    }
}
function makeException(name) {
    return class extends exception_Exception {
        constructor() {
            super(...arguments);
            this._name = name;
        }
    };
}
const exception_SyntaxException = makeException("SyntaxException");
const CloneException = makeException("CloneException");
const exception_NumberTooSmallException = makeException("NumberTooSmallException");
const exception_TypeException = makeException("TypeException");
const NotImplementedException = makeException("NotImplementedException");
const UnknownException = makeException("UnknownException");
const AccessException = makeException("AccessException");
const AssertionException = makeException("AssertionException");
/** @future */
const FetchException = makeException("FetchException");
const SortException = makeException("SortException");
const exception_DebouncedException = makeException("DebouncedException");
const exception_AbstractMethodInvokedException = makeException("AbstractMethodInvokedException");
const exception_AbstractInitializationException = makeException("AbstractInitializationException");
const exception_CollectionOutOfBoundsException = makeException("CollectionOutOfBoundsException");
const exception_MalformedQueryException = makeException("MalformedQueryException");

;// ./src/misc.ts
//* Function
function misc_args() {
    var _a;
    return ((_a = this.toString()
        .replace(/\s*=\s*.*?(,|\))/g, "$1")
        .match(/\(([^)]*)\)/)) === null || _a === void 0 ? void 0 : _a[1].split(",").map(p => p.trim()).filter(Boolean)) || [];
}
function throttle(func, ms) {
    let throttled = false;
    const cache = [];
    return function (...args) {
        if (!throttled) {
            const self = this;
            throttled = true;
            const val = func.apply(self, args);
            setTimeout(() => {
                throttled = false;
                if (cache.length > 0)
                    func.apply(self, cache.shift());
            }, ms);
            return val;
        }
        cache.push(args);
        return null;
    };
}
function debounce(func, ms) {
    let timer = null;
    let globRej = null;
    return function (...args) {
        if (globRej && timer) {
            const rej = globRej;
            globRej = null;
            rej(new DebouncedException());
        }
        const self = this;
        // Clear existing timer
        if (timer)
            clearTimeout(timer);
        return new Future((res, rej) => {
            globRej = rej;
            timer = setTimeout(() => {
                globRej = null;
                timer = null; // clear timer reference
                res(func.apply(self, args));
            }, ms);
        });
    };
}
function memo(fn) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args); // unique per argument set
        if (cache.has(key))
            return cache.get(key); // return cached result
        const result = fn.apply(this, args); // call original function
        cache.set(key, result); // store in cache
        return result;
    };
}
//* Date
function atDate(year, monthIndex, date, hours, minutes, seconds, ms) {
    return new Date(year, monthIndex, date, hours, minutes, seconds, ms).getTime();
}
function fromTime(time, year, monthIndex, date) {
    return new Date(year, monthIndex, date, time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
}
function clone(object, deep = true) {
    if (typeof object === "symbol") {
        throw new globalThis.CloneException("Symbols cannot be cloned");
    }
    if (!deep) {
        if (Array.isArray(object)) {
            return [...object];
        }
        return Object.assign({}, object);
    }
    if (object === null ||
        object === undefined ||
        typeof object !== "object") {
        return object;
    }
    if (object instanceof Date) {
        return new Date(object.getTime());
    }
    // Handle Arrays
    if (Array.isArray(object)) {
        return object.map(item => clone(item, true));
    }
    // Handle Maps
    if (object instanceof Map) {
        return new Map([...object].map(([k, v]) => [k, clone(v, true)]));
    }
    // Handle Sets
    if (object instanceof Set) {
        return new Set([...object].map(item => clone(item, true)));
    }
    // Handle plain objects
    const proto = Object.getPrototypeOf(object);
    const result = Object.create(proto);
    for (const key of Reflect.ownKeys(object)) {
        const value = object[key];
        result[key] = deep ? clone(value, true) : value;
    }
    return result;
}
;
function forEach(object, iterator) {
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            iterator(key, object[key]);
        }
    }
}
;
//* Number
function repeat(iterator) {
    for (let i = 0; i < this; i++) {
        iterator(i);
    }
}
;
//* Strings
function remove(finder) {
    return this.replace(finder, "");
}
;
function capitalize() {
    const i = this.search(/\S/);
    return i === -1 ? this : this.slice(0, i) + this.charAt(i).toUpperCase() + this.slice(i + 1);
}
;
function matches(regexp) {
    return this.search(regexp) !== -1;
}
;
function toCase(format) {
    const regex = /([\s_-]+)(\S)/g;
    const charRegex = /[\s]+/g;
    switch (format) {
        case "kebab": return this.replace(charRegex, "-");
        case "snake": return this.replace(charRegex, "_");
        case "dot": return this.replace(charRegex, ".");
        case "camel": return this.replace(regex, (_, _s, next) => next.toUpperCase());
        case "pascal": return this.replace(regex, (_, _s, next) => next.toUpperCase()).replace(/^\s*(\S)/, (_, first) => first.toUpperCase());
        case "train": return this.replace(regex, (_, _s, next) => next.toUpperCase()).replace(/^\s*(\S)/, (_, first) => first.toUpperCase());
    }
}
//* Math
const origionalRandom = Math.random;
const random = (minOrMax, max) => {
    if (typeof minOrMax !== "undefined" && typeof max !== "undefined") {
        return origionalRandom() * (max - minOrMax) + minOrMax;
    }
    else if (typeof minOrMax !== "undefined") {
        return origionalRandom() * minOrMax;
    }
    else
        return origionalRandom();
};
function mixin(fn, location, mixinFn) {
    switch (location) {
        case "HEAD":
            return (function (...args) {
                mixinFn.call(this, ...args);
                return fn.call(this, ...args);
            });
        case "TAIL":
            return (function (...args) {
                const result = fn.call(this, ...args);
                const self = Object.assign({ mixin: { value: result } }, this);
                mixinFn.call(self, ...args);
                return result;
            });
    }
}
function getEvents(key) {
    var _a;
    return (_a = this._events[key]) !== null && _a !== void 0 ? _a : [];
}
const originalAddEventListener = EventTarget.prototype.addEventListener;
const addEventListener = mixin(originalAddEventListener, "HEAD", function (type, callback, options) {
    var _a;
    var _b;
    if (!(this instanceof EventTarget))
        return;
    (_a = (_b = this._events)[type]) !== null && _a !== void 0 ? _a : (_b[type] = []);
    if ("handleEvent" in callback) {
        this._events[type].push(callback.handleEvent);
    }
    else {
        this._events[type].push(callback);
    }
});

;// ./src/globals.ts

function typeObject(val, str) {
    let v = val;
    let obj = Object.create({
        get value() {
            return v;
        },
        stringOf() { return str; },
        is(other) {
            var _a;
            switch (typeof other) {
                case "string":
                    if (other.startsWith("type:")) {
                        return other.replace("type:", "") === str;
                    }
                case "number":
                case "bigint":
                case "boolean":
                case "symbol":
                    return v === other;
                case "function":
                    const regex = /<([\w$_0-9]+)>\(([\w$_0-9,\s]*)\)/;
                    const match = str.match(regex);
                    if (match) {
                        const [, name, args] = match;
                        return name === (other.name || "anonymous") && args === misc_args.apply(other).join(",");
                    }
                    throw new TypeException(`Internal type matching error: Incorrect format for type string ${str}`);
                case "undefined":
                    return v === undefined;
                case "object":
                    if (other === null) {
                        return v === null;
                    }
                    const ctorName = (_a = other.constructor) === null || _a === void 0 ? void 0 : _a.name;
                    if (ctorName && str.includes(ctorName))
                        return true;
                    if (typeof other.toString === "function") {
                        return str === other.toString();
                    }
                    return false;
            }
        },
        isInstanceOf(clazz) {
            if (v === null || v === undefined)
                return false;
            return Object(v) instanceof clazz;
        },
        isDefined() {
            return v !== undefined && v !== null;
        },
        isFalsy() {
            return !v;
        },
        isTruthy() {
            return !!v;
        },
        isNull() {
            return v === null;
        },
        isUndefined() {
            return v === undefined;
        },
        alwaysDefined(orElse) {
            v !== null && v !== void 0 ? v : (v = orElse);
        },
        alwaysTruthy(truthy) {
            v = truthy;
        },
        isTypeString(typestr) {
            return typestr === str;
        },
        isTypeOf(type) {
            return typeof v === type;
        }
    });
    function hasOwn(val, prop) {
        if (val === null || val === undefined) {
            return false;
        }
        if (typeof val === "string")
            return true;
        return Object.prototype.hasOwnProperty.call(val, prop);
    }
    if (typeof v === "string" || hasOwn(v, "size") || hasOwn(v, "length")) {
        obj = Object.assign(obj, {
            isShorter(lengthOrObject) {
                const len = typeof lengthOrObject === "number"
                    ? lengthOrObject
                    : ("size" in lengthOrObject
                        ? lengthOrObject.size
                        : lengthOrObject.length);
                if (hasOwn(v, "size") && typeof v.size === "number") {
                    return v.size < len;
                }
                else if (typeof v === "string" || (hasOwn(v, "length") && typeof v.length === "number")) {
                    return v.length < len;
                }
                return false;
            },
            isLonger(lengthOrObject) {
                const len = typeof lengthOrObject === "number"
                    ? lengthOrObject
                    : ("size" in lengthOrObject
                        ? lengthOrObject.size
                        : lengthOrObject.length);
                if (hasOwn(v, "size") && typeof v.size === "number") {
                    return v.size > len;
                }
                else if (hasOwn(v, "length") && typeof v.length === "number") {
                    return v.length > len;
                }
                return false;
            },
            isLength(length) {
                if (hasOwn(v, "size") && typeof v.size === "number") {
                    return v.size === length;
                }
                else if (hasOwn(v, "length") && typeof v.length === "number") {
                    return v.length === length;
                }
                return false;
            }
        });
    }
    if (Array.isArray(v)) {
        obj = Object.assign(obj, {
            containsValues() {
                console.log("len", v.length);
                return v.length > 0;
            },
            alwaysContainsValues(values) {
                if (v.length === 0) {
                    v.push(...values);
                }
            }
        });
    }
    if (typeof v === "function") {
        const functionName = v.name;
        obj = Object.assign(obj, {
            isName(name) {
                if (functionName === "")
                    return name === "anonymous";
                return functionName === name;
            }
        });
    }
    return obj;
}
function typed(val) {
    if (val === null)
        return typeObject(val, "null");
    if (val === undefined)
        return typeObject(val, "undefined");
    if (typeof val === "function") {
        // const combos: any[][] = [];
        // const primitives = [
        //   undefined,
        //   null,
        //   true,
        //   false,
        //   -1,
        //   0,
        //   1,
        //   Infinity,
        //   NaN,
        //   "",
        //   "text",
        //   Symbol("sym")
        // ];
        // const err: any[] = [];
        // const arity = val.length;
        // for (let i = 0; i < arity; i++) {
        //   combos.push(primitives);
        // }
        // for (const combo of combos) {
        //   try {
        //     val(...combo);
        //     continue;
        //   } catch (e) {
        //     if (e instanceof TypeError) err.push(combo);
        //     else throw e;
        //   }
        // }
        return typeObject(val, `Function:${val.name || "<anonymous>"}(${misc_args.apply(val).join(",")})`);
    }
    let typeName = Object.prototype.toString.call(val).slice(8, -1);
    typeName = typeName[0].toUpperCase() + typeName.slice(1);
    console.log("Type", typeName);
    const ctor = val.constructor.name;
    if (ctor && ctor === "Object") {
        typeName = ctor;
    }
    console.log("Type", typeName);
    switch (typeof val) {
        case "string":
            typeName += `(${val.length})`;
            break;
        case "object":
            if (val instanceof Map || val instanceof Set) {
                typeName += `(${val.size})`;
            }
            else if (val instanceof Date && !isNaN(val.getTime())) {
                typeName += `:${val.toISOString().split("T")[0]}`;
            }
            else if ("length" in val && Number.isFinite(val.length)) {
                typeName += `(${val.length})`;
            }
            else if (typeName === "Object") {
                typeName += `(${Object.keys(val).length})`;
            }
            break;
        case "symbol":
            typeName += `(${val.description})`;
    }
    return typeObject(val, typeName);
}
;
function info(val) {
    return String(val);
}
function assert(condition, reason) {
    if (!condition) {
        throw new globalThis.AssertionException(reason);
    }
}
function sleep(ms) {
    return new Future((res, rej) => {
        if (ms <= 0)
            return rej(new NumberTooSmallException("Invalid timeout value (must be greater than 0)"));
        setTimeout(res, ms);
    });
}
function isEmpty(val) {
    // Generic type checking
    // eslint-disable-next-line eqeqeq
    if (val == null || val === false || val === "")
        return true;
    // Number checking
    if (typeof val === "number")
        return val === 0 || Number.isNaN(val);
    // Array checking
    if (Array.isArray(val) && val.length === 0)
        return true;
    // Map, Set, and weak variant checks
    if (val instanceof Map || val instanceof Set || val instanceof WeakMap || val instanceof WeakSet) {
        return val.size === 0; // size check works for these types
    }
    // Object checking
    if (typeof val === 'object') {
        const proto = Object.getPrototypeOf(val);
        const isPlain = proto === Object.prototype || proto === null;
        return isPlain && Object.keys(val).length === 0;
    }
    return false;
}
function notEmpty(val) {
    return !isEmpty(val);
}
// eslint-disable-next-line prefer-const
let opti = {
    crafty: false,
    query: false,
    evented: false,
    requests: false,
    templated: false,
    flow: false,
    help: {}
};

;// ./src/lists.ts
function addClassList(elClass) {
    for (const el of this) {
        el.addClass(elClass);
    }
}
;
function removeClassList(elClass) {
    for (const el of this) {
        el.removeClass(elClass);
    }
}
;
function toggleClassList(elClass) {
    for (const el of this) {
        el.toggleClass(elClass);
    }
}
;

;// ./src/arrays.ts
function unique() {
    return [...new Set(this)];
}
;
function pluck(finder) {
    const res = this.findIndex(finder);
    if (res === -1)
        return null;
    const [item] = this.splice(res, 1);
    return item;
}
function pluckLast(finder) {
    // find index of last matching element
    const index = this.map(finder).lastIndexOf(true);
    if (index === -1)
        return null;
    // remove and return it
    const [item] = this.splice(index, 1);
    return item;
}
function relocate(index, offset) {
    var _a;
    const value = (_a = this.splice(index, 1)[0]) !== null && _a !== void 0 ? _a : null;
    if (value) {
        this.splice(index + offset, 0, value);
        return index + offset;
    }
    else
        return null;
}
function relocateTo(index, location) {
    var _a;
    const value = (_a = this.splice(index, 1)[0]) !== null && _a !== void 0 ? _a : null;
    if (value) {
        this.splice(location, 0, value);
        return location;
    }
    else
        return null;
}
function arrayType() {
    return this.map(v => globalThis.typed(v).stringOf());
}
function arrType(array, type) {
    return array.every(v => type === String ? typeof v === "string" :
        type === Number ? typeof v === "number" :
            type === Boolean ? typeof v === "boolean" :
                type === Symbol ? typeof v === "symbol" :
                    v instanceof type);
}
const origionalSort = Array.prototype.sort;
function sortBy(order) {
    if (typeof order === "function") {
        return origionalSort.call(this, order);
    }
    else if (order === undefined) {
        return origionalSort.call(this);
    }
    const copy = [...this];
    if (arrType(this, Date)) {
        switch (order) {
            case "earlier": return origionalSort.call(copy, (a, b) => a.getTime() - b.getTime());
            case "later": return origionalSort.call(copy, (a, b) => b.getTime() - a.getTime());
        }
    }
    else if (arrType(this, String)) {
        switch (order) {
            case "alpha": return origionalSort.call(copy);
            case "alpha-reverse": return origionalSort.call(copy).reverse();
        }
    }
    else if (arrType(this, Number)) {
        switch (order) {
            case "increasing": return origionalSort.call(copy, (a, b) => a - b);
            case "decreasing": return origionalSort.call(copy, (a, b) => b - a);
        }
    }
    return origionalSort.call(this);
}
function shuffle() {
    return this.sort(() => {
        return Math.random() - 0.5;
    });
}
function replace(index, newVal) {
    if (typeof index === "number") {
        const oldVal = this[index];
        this[index] = newVal;
        return oldVal !== null && oldVal !== void 0 ? oldVal : null;
    }
    else {
        const i = this.findIndex(index);
        if (i === -1)
            return null;
        const oldVal = this[i];
        this[i] = newVal;
        return oldVal;
    }
}
function replaceLast(finder, newVal) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (finder(this[i])) {
            const oldVal = this[i];
            this[i] = newVal;
            return oldVal !== null && oldVal !== void 0 ? oldVal : null;
        }
    }
    return null;
}
function chunk(chunkSize) {
    if (chunkSize <= 0)
        throw new globalThis.NumberTooSmallException("`chunkSize` cannot be a number below 1");
    const newArr = [];
    let tempArr = [];
    this.forEach(val => {
        tempArr.push(val);
        if (tempArr.length === chunkSize) {
            newArr.push(tempArr);
            tempArr = []; // Reset tempArr for the next chunk
        }
    });
    // Add the remaining elements in tempArr if any
    if (tempArr.length) {
        newArr.push(tempArr);
    }
    return newArr;
}
;
function insert(index, ...values) {
    this.splice(index, 0, ...values);
}

;// ./src/decorators.ts
function isClass(x) {
    return typeof x === "function";
}
function Abstract(target, propertyKey, descriptor) {
    // --- CLASS DECORATOR ---
    if (propertyKey === undefined) {
        if (!isClass(target)) {
            throw new Exception("@Abstract must be used on a class or function");
        }
        const Original = target;
        const Wrapper = class extends Original {
            constructor(...args) {
                if (new.target === Original) {
                    throw new AbstractInitializationException(`Abstract class ${Original.name} cannot be instantiated directly`);
                }
                super(...args);
            }
        };
        Object.defineProperty(Wrapper, "name", { value: Original.name });
        return Wrapper;
    }
    // --- METHOD DECORATOR ---
    if (!descriptor || typeof descriptor.value !== "function") {
        throw new Error("@Abstract can only be applied to methods");
    }
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        if (this.constructor === target.constructor) {
            throw new AbstractMethodInvokedException(`Abstract method ${String(propertyKey)} must be overridden`);
        }
        return originalMethod.apply(this, args);
    };
    return descriptor;
}
function Final(target, propertyKey, descriptor) {
    if (descriptor) {
        // Decorating a method: make it non-writable
        descriptor.writable = false;
        return;
    }
    // Decorating a class: prevent subclassing
    const original = target;
    function FinalizedConstructor(...args) {
        if (new.target !== original) {
            throw new Exception(`${original.name} is a final class and cannot be extended`);
        }
        return Reflect.construct(original, args, new.target);
    }
    // Copy prototype
    FinalizedConstructor.prototype = original.prototype;
    return FinalizedConstructor;
}

;// ./src/opti.ts









function get(object, prop, getter) {
    Object.defineProperty(object, prop, {
        get: getter,
        enumerable: false,
        configurable: true
    });
}
(function () {
    globalThis.opti = {
        crafty: false,
        query: false,
        evented: false,
        requests: false,
        flow: false
    };
    //! Others may depend on these
    globalThis.Collection = Collection;
    globalThis.Future = Promise;
    globalThis.Exception = exception_Exception;
    globalThis.SyntaxException = exception_SyntaxException;
    globalThis.TypeException = exception_TypeException;
    globalThis.CloneException = CloneException;
    globalThis.NumberTooSmallException = exception_NumberTooSmallException;
    globalThis.AssertionException = AssertionException;
    globalThis.NotImplementedException = NotImplementedException;
    globalThis.AccessException = AccessException;
    globalThis.UnknownException = UnknownException;
    globalThis.DebouncedException = exception_DebouncedException;
    globalThis.AbstractMethodInvokedException = exception_AbstractMethodInvokedException;
    globalThis.AbstractInitializationException = exception_AbstractInitializationException;
    globalThis.SortException = SortException;
    globalThis.CollectionOutOfBoundsException = exception_CollectionOutOfBoundsException;
    globalThis.MalformedQueryException = exception_MalformedQueryException;
    globalThis.RuntimeException = RuntimeException;
    globalThis.Abstract = Abstract;
    globalThis.Final = Final;
    Object.defineProperty(globalThis, "f", {
        value: (iife) => iife(),
        writable: false,
        configurable: false,
    });
    globalThis.typed = typed;
    globalThis.assert = assert;
    globalThis.sleep = sleep;
    globalThis.isEmpty = isEmpty;
    globalThis.notEmpty = notEmpty;
    globalThis.Enum = Enum;
    globalThis.Tuple = Tuple;
    Document.prototype.ready = ready;
    Document.prototype.leaving = leaving;
    Document.prototype.css = documentCss;
    Document.prototype.createElements = createElements;
    Node.prototype.$ = elements_$;
    Node.prototype.$$ = elements_$$;
    Node.prototype.parent = getParent;
    Node.prototype.ancestor = getAncestor;
    Node.prototype.getChildren = getChildren;
    Node.prototype.siblings = getSiblings;
    Element.prototype.hasText = hasText;
    Element.prototype.txt = elements_text;
    Element.prototype.html = html;
    Element.prototype.addClass = addClass;
    Element.prototype.removeClass = removeClass;
    Element.prototype.toggleClass = toggleClass;
    Element.prototype.hasClass = hasClass;
    HTMLElement.prototype.css = css;
    HTMLElement.prototype.show = show;
    HTMLElement.prototype.hide = hide;
    HTMLElement.prototype.toggle = toggle;
    get(HTMLElement.prototype, "isVisible", isVisible);
    get(HTMLInputElement.prototype, "val", val);
    HTMLFormElement.prototype.serialize = serialize;
    NodeList.prototype.addClass = addClassList;
    NodeList.prototype.removeClass = removeClassList;
    NodeList.prototype.toggleClass = toggleClassList;
    HTMLCollection.prototype.addClass = addClassList;
    HTMLCollection.prototype.removeClass = removeClassList;
    HTMLCollection.prototype.toggleClass = toggleClassList;
    EventTarget.prototype.addEventListener = addEventListener;
    EventTarget.prototype._events = {};
    EventTarget.prototype.getEvents = getEvents;
    String.prototype.remove = remove;
    String.prototype.matches = matches;
    String.prototype.capitalize = capitalize;
    String.prototype.toCase = toCase;
    Number.prototype.repeat = repeat;
    Function.debounce = debounce;
    Function.throttle = throttle;
    Function.memo = memo;
    Function.prototype.getArgs = misc_args;
    Array.prototype.unique = unique;
    Array.prototype.chunk = chunk;
    Array.prototype.pluck = pluck;
    Array.prototype.pluckLast = pluckLast;
    Array.prototype.relocate = relocate;
    Array.prototype.relocateTo = relocateTo;
    Array.prototype.replace = replace;
    Array.prototype.replaceLast = replaceLast;
    Array.prototype.sort = sortBy;
    Array.prototype.insert = insert;
    get(Array.prototype, "type", arrayType);
    Math.random = random;
    Object.clone = clone;
    Object.forEach = forEach;
    Date.at = atDate;
    Date.fromTime = fromTime;
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});