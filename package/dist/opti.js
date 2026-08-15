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

;// ./package/src/helpers.ts
function arrType(array, type) {
    return array.every(v => type === String ? typeof v === "string" :
        type === Number ? typeof v === "number" :
            type === Boolean ? typeof v === "boolean" :
                type === Symbol ? typeof v === "symbol" :
                    v instanceof type);
}
function isEventTarget(obj) {
    return (obj &&
        typeof obj.addEventListener === "function" &&
        typeof obj.removeEventListener === "function" &&
        typeof obj.dispatchEvent === "function");
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function declare(f) {
    f.call(globalThis, globalThis);
}
function createModuleError(submodule) {
    return new Error(`Opti should be imported before the import for opti/${submodule}`, {
        cause: `Not importing opti before importing opti/${submodule}`
    });
}
function setNotEnumerable(obj, prop, val) {
    Object.defineProperty(obj, prop, {
        value: val,
        enumerable: false,
        writable: true,
        configurable: true
    });
}
function setNameOfGlobalThisProp(cls) {
    Object.defineProperty(globalThis[cls], "name", { value: cls });
}
function setPropName(cls, prop) {
    Object.defineProperty(cls[prop], "name", { value: prop });
}
function setGetter(object, prop, getter) {
    Object.defineProperty(object, prop, {
        get: getter,
        enumerable: false,
        configurable: true
    });
}
function setReadOnly(object, prop, val) {
    Object.defineProperty(object, prop, {
        value: val,
        enumerable: false,
        configurable: true
    });
}
function supportsStyles(el) {
    return el instanceof HTMLElement || el instanceof SVGElement || el instanceof MathMLElement;
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
function camelToDash(str) {
    return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}
function parseTime(value) {
    const [h, m, s] = value.split(":");
    const [sec, ms] = (s ?? "0").split(".");
    const date = new Date();
    date.setHours(+(h || 0), +(m || 0), +(sec || 0), +(ms || 0));
    return date;
}
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

;// ./package/src/Core/constructableobjects.ts
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

;// ./package/src/Core/document.ts
function ready(callback) {
    document.addEventListener("DOMContentLoaded", callback);
}
let called = false;
function leaving(callback) {
    if (called)
        return;
    function handler(e) {
        try {
            callback.call(document, e);
        }
        finally {
            called = true;
        }
    }
    if ('onbeforeunload' in window)
        window.addEventListener('beforeunload', handler, { once: true });
    if ('onpagehide' in window)
        window.addEventListener('pagehide', handler, { once: true });
    document.addEventListener('visibilitychange', (e) => {
        if (document.visibilityState === 'hidden')
            handler(e);
    }, { once: true });
}
function documentCss(element, object) {
    const selector = element.trim();
    if (!selector) {
        throw new globalThis.SyntaxException("Selector cannot be empty.");
    }
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
                if (!name)
                    continue;
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
            const kebab = prop.toString().replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
            newStyles[kebab] = val.toString();
        }
    }
    const mergedStyles = { ...existingStyles, ...newStyles };
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

;// ./package/src/Core/nodes.ts


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
function css(key, value) {
    const icss = this.style;
    // If request for computed styles or all styles
    if (!key || key === true) {
        // Return all styles
        const result = {};
        for (let i = 0; i < icss.length; i++) {
            const prop = icss[i];
            if (!prop)
                continue;
            const camelProp = dashToCamel(prop);
            const style = icss.getPropertyValue(prop).trim();
            result[camelProp] = parseUnit(style);
        }
        if (key === true) {
            const computed = window.getComputedStyle(this);
            const computedObj = {};
            for (let i = 0; i < computed.length; i++) {
                const prop = computed[i];
                if (!prop)
                    continue;
                const camelProp = dashToCamel(prop);
                const style = computed.getPropertyValue(prop).trim();
                computedObj[camelProp] = parseUnit(style);
            }
            return { ...result, ...computedObj };
        }
        return result;
    }
    if (typeof key === "string") {
        if (value === undefined) {
            return parseUnit(icss.getPropertyValue(camelToDash(key)).trim());
        }
        else if (value === null) {
            icss.removeProperty(camelToDash(key));
        }
        else {
            // Set one value
            if (key in icss) {
                icss.setProperty(camelToDash(key), value.toString());
            }
        }
    }
    else {
        // Set multiple
        for (const [prop, ival] of Object.entries(key)) {
            if (ival !== null && ival !== undefined) {
                icss.setProperty(camelToDash(prop.toString()), ival.toString());
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
            if (!node?.parentNode)
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
function txt(modifier, ...newText) {
    // If text is provided, update the textContent
    if (modifier !== undefined) {
        if (typeof modifier === "string") {
            const inputText = [...newText];
            inputText.unshift(modifier);
            this.textContent = inputText.join(" ");
        }
        else {
            this.textContent = modifier(this.textContent);
        }
    }
    return this.textContent;
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
function $(selector) {
    if (selector.includes(","))
        throw new SyntaxException("Invalid query: commas are not allowed in query selectors that can only select 1 element");
    return this.querySelector(selector);
}
;
function $$(selector) {
    return Array.from(this.querySelectorAll(selector));
}
;
function getChildren() {
    return this.childNodes;
}
;
function getSiblings(inclusive) {
    if (!this.parentNode)
        return [];
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
    const formData = new FormData(this);
    const entries = [];
    formData.forEach((value, key) => {
        entries.push([key, value.toString()]);
    });
    return entries
        .map(([key, value]) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
        .join('&');
}
;
function cut() {
    if (!this.parentNode)
        throw new HierarchyException("Element cannot be cut out of the DOM because it has no parent");
    if ("remove" in this && typeof this.remove === 'function') {
        this.remove();
    }
    else {
        this.parentNode.removeChild(this);
    }
}
const defaultCopy = {
    copyAll: false,
    copyAttributes: true,
    copyChildren: false,
    copyStyles: true
};
function copy(childrenOrObject = true) {
    const incomingOptions = typeof childrenOrObject === "boolean"
        ? { copyChildren: childrenOrObject }
        : (childrenOrObject ?? {});
    // 2. Merge defaults cleanly. TypeScript guarantees full type safety here.
    const options = { ...defaultCopy, ...incomingOptions };
    const clone = document.createElementNS(this.namespaceURI, this.tagName);
    if (options.copyAttributes || options.copyAll) {
        if (this instanceof HTMLElement && clone instanceof HTMLElement) {
            if (this.title)
                clone.title = this.title;
            if (this.role)
                clone.role = this.role;
            if (this.ariaChecked)
                clone.ariaChecked = this.ariaChecked;
            clone.hidden = this.hidden;
            clone.tabIndex = this.tabIndex;
            // Sync datasets securely
            Object.assign(clone.dataset, this.dataset);
        }
        for (const attribute of Array.from(this.attributes)) {
            // Skip styles (so that copyStyles works)
            if (attribute.name === "style")
                continue;
            if (attribute.name === "id" && attribute.value !== "") {
                if (!options.fallbackId) {
                    console.warn("Fallback ID is not set. Skipping application of ID");
                    clone.id = "";
                    continue;
                }
                else {
                    clone.id = options.fallbackId;
                    continue;
                }
            }
            clone.setAttribute(attribute.name, attribute.value);
        }
    }
    if (options.copyChildren || options.copyAll) {
        if (!this.children.length && this.innerHTML) {
            clone.innerHTML = this.innerHTML;
        }
        else {
            for (const child of Array.from(this.childNodes)) {
                let childCopy;
                if (child instanceof Element) {
                    const optionsCopy = { ...options };
                    delete optionsCopy.fallbackId;
                    childCopy = child.copy(optionsCopy);
                }
                else {
                    childCopy = child.cloneNode(true);
                }
                clone.appendChild(childCopy);
            }
        }
    }
    if (options.copyStyles || options.copyAll) {
        if (this instanceof HTMLElement && clone instanceof HTMLElement) {
            clone.style.cssText = this.style.cssText;
        }
    }
    return clone;
}
function isVisible() {
    if (!this.isConnected)
        return false;
    const elCss = window.getComputedStyle(this);
    return (elCss.display !== "none" &&
        elCss.visibility !== "hidden" &&
        parseFloat(elCss.opacity) > 0);
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
            return self.value ?? "";
        },
        inferred() {
            return this.asDate() || this.asBoolean() || this.asNumber() || this.asString();
        },
        get type() {
            return self.type;
        }
    };
}
;
function attr(key, value) {
    if (value)
        this[key] = value;
    else
        return this[key];
}

;// ./package/src/Core/exceptions.ts
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Exception_message, _Exception_cause, _Exception_internalStack, _RuntimeException_message, _RuntimeException_cause, _RuntimeException_stack;
class Exception extends Error {
    constructor(message, cause) {
        super();
        _Exception_message.set(this, void 0);
        _Exception_cause.set(this, void 0);
        _Exception_internalStack.set(this, void 0);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
        __classPrivateFieldSet(this, _Exception_message, message ?? "", "f");
        __classPrivateFieldSet(this, _Exception_cause, cause ?? "", "f");
        __classPrivateFieldSet(this, _Exception_internalStack, super.stack ?? "", "f");
    }
    getName() {
        return this.constructor.name;
    }
    getMessage() {
        return __classPrivateFieldGet(this, _Exception_message, "f");
    }
    getCause() {
        return __classPrivateFieldGet(this, _Exception_cause, "f");
    }
    throw() {
        throw this;
    }
    getStackTrace() {
        return __classPrivateFieldGet(this, _Exception_internalStack, "f");
    }
    toString() {
        return `${this.constructor.name}: ${__classPrivateFieldGet(this, _Exception_message, "f")}\r\n${__classPrivateFieldGet(this, _Exception_internalStack, "f")}`;
    }
    static isException(val) {
        return val instanceof Exception;
    }
    static isAnyException(val) {
        return val instanceof Exception || val instanceof RuntimeException;
    }
}
_Exception_message = new WeakMap(), _Exception_cause = new WeakMap(), _Exception_internalStack = new WeakMap();
class RuntimeException {
    constructor(message = "", cause = "") {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "RuntimeException"
        });
        _RuntimeException_message.set(this, void 0);
        _RuntimeException_cause.set(this, void 0);
        _RuntimeException_stack.set(this, void 0);
        __classPrivateFieldSet(this, _RuntimeException_message, message, "f");
        __classPrivateFieldSet(this, _RuntimeException_cause, cause, "f");
        __classPrivateFieldSet(this, _RuntimeException_stack, new Error().stack ?? "", "f");
    }
    getName() {
        return 'RuntimeException';
    }
    getMessage() {
        return __classPrivateFieldGet(this, _RuntimeException_message, "f");
    }
    getCause() {
        return __classPrivateFieldGet(this, _RuntimeException_cause, "f");
    }
    toString() {
        return `RuntimeException${__classPrivateFieldGet(this, _RuntimeException_message, "f") ? ": " + __classPrivateFieldGet(this, _RuntimeException_message, "f") : ""}`;
    }
    getStackTrace() {
        return __classPrivateFieldGet(this, _RuntimeException_stack, "f");
    }
    throw() {
        throw this;
    }
}
_RuntimeException_message = new WeakMap(), _RuntimeException_cause = new WeakMap(), _RuntimeException_stack = new WeakMap();
class exceptions_SyntaxException extends Exception {
}
class exceptions_CloneException extends Exception {
}
class exceptions_HierarchyException extends Exception {
}
class NumberException extends (/* unused pure expression or super */ null && (Exception)) {
}
class exceptions_NumberTooSmallException extends Exception {
}
class exceptions_TypeException extends Exception {
}
class NotImplementedException extends Exception {
}
class UnknownException extends Exception {
}
class AccessException extends Exception {
}
class AssertionException extends Exception {
}
class FetchException extends Exception {
}
class exceptions_DebouncedException extends Exception {
}
class exceptions_RegistryException extends Exception {
}

;// ./package/src/Core/globals.ts
function typeObject(val, str) {
    const v = val;
    let obj = Object.create({
        getValue() { return val; },
        stringOf() { return str; },
        equalTo(other) {
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
                    const regex = /<([\w$_0-9]+)>\((\d+)\)/;
                    const match = str.match(regex);
                    if (match) {
                        const [, name, argsStr] = match;
                        const args = Number(argsStr);
                        if (Number.isNaN(args)) {
                            throw new TypeException(`Internal type matching error: ${argsStr} is not a number.`);
                        }
                        else if (!Number.isFinite(args)) {
                            throw new TypeException(`Internal type matching error: ${argsStr} is infinite.`);
                        }
                        return name === (other.name || "anonymous") && args === other.length;
                    }
                    throw new TypeException(`Internal type matching error: Incorrect format for type string ${str}`);
                case "undefined":
                    return v === undefined;
                case "object":
                    if (other === null) {
                        return v === null;
                    }
                    const ctorName = other.constructor?.name;
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
            return !Boolean(v);
        },
        isTruthy() {
            return Boolean(v);
        },
        isNull() {
            return v === null;
        },
        isUndefined() {
            return v === undefined;
        },
        isTypeString(typestr) {
            return typestr === str;
        }
    });
    function hasOwn(intVal, prop) {
        if (intVal === null || intVal === undefined) {
            return false;
        }
        if (typeof intVal === "string")
            return true;
        return Object.prototype.hasOwnProperty.call(intVal, prop);
    }
    if (typeof v === "string" || hasOwn(v, "size") || hasOwn(v, "length")) {
        obj = Object.assign(obj, {
            shorter(lengthOrObject) {
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
            longer(lengthOrObject) {
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
            length(length) {
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
function is(val) {
    if (val === null)
        return typeObject(val, "null");
    if (val === undefined)
        return typeObject(val, "undefined");
    if (typeof val === "function")
        return typeObject(val, `Function:${val.name || "<anonymous>"}(${val.length})`);
    let typeName = Object.prototype.toString.call(val).slice(8, -1);
    typeName = (typeName[0]?.toUpperCase() ?? "") + typeName.slice(1);
    const ctor = val.constructor.name;
    if (ctor && ctor === "Object") {
        typeName = ctor;
    }
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
    if (val instanceof Map || val instanceof Set) {
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

;// ./package/src/Core/collections.ts
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

;// ./package/src/Core/arrays.ts

function unique() {
    return [...new Set(this)];
}
;
function pluck(finder) {
    const res = this.findIndex(finder);
    if (res === -1)
        return null;
    const [item] = this.splice(res, 1);
    return item ?? null;
}
function pluckLast(finder) {
    const index = this.map(finder).lastIndexOf(true);
    if (index === -1)
        return null;
    const [item] = this.splice(index, 1);
    return item ?? null;
}
function relocate(index, offset) {
    const value = this.splice(index, 1)[0];
    if (value !== undefined) {
        this.splice(index + offset, 0, value);
        return index + offset;
    }
    else {
        return null;
    }
}
function relocateTo(index, location) {
    const value = this.splice(index, 1)[0];
    if (value !== undefined) {
        this.splice(location, 0, value);
        return location;
    }
    else
        return null;
}
const originalSort = Array.prototype.sort;
function sortBy(order) {
    if (typeof order === "function") {
        return originalSort.call(this, order);
    }
    else if (order === undefined) {
        return originalSort.call(this);
    }
    const copy = [...this];
    if (arrType(this, Date)) {
        switch (order) {
            case "earlier": return originalSort.call(copy, (a, b) => a.getTime() - b.getTime());
            case "later": return originalSort.call(copy, (a, b) => b.getTime() - a.getTime());
        }
    }
    else if (arrType(this, String)) {
        switch (order) {
            case "alpha": return originalSort.call(copy);
            case "alpha-reverse": return originalSort.call(copy).reverse();
        }
    }
    else if (arrType(this, Number)) {
        switch (order) {
            case "increasing": return originalSort.call(copy, (a, b) => a - b);
            case "decreasing": return originalSort.call(copy, (a, b) => b - a);
        }
    }
    return copy.sort();
}
function replace(index, newVal) {
    if (typeof index === "number") {
        const oldVal = this[index];
        this[index] = newVal;
        return oldVal ?? null;
    }
    else {
        const i = this.findIndex(index);
        if (i === -1)
            return null;
        const oldVal = this[i];
        this[i] = newVal;
        return oldVal ?? null;
    }
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

;// ./package/src/Core/misc.ts
//* Function
function throttle(func, ms) {
    let timer = null;
    let storedArgs = null;
    let context = null;
    return function (...rest) {
        if (timer) {
            storedArgs = rest;
            context = this;
            return null;
        }
        // Leading execution
        const result = func.apply(this, rest);
        const startTimer = () => {
            timer = setTimeout(() => {
                if (storedArgs) {
                    func.apply(context, storedArgs);
                    storedArgs = null;
                    context = null;
                    startTimer(); // Restart to handle the next window
                }
                else {
                    timer = null;
                }
            }, ms);
        };
        startTimer();
        return result;
    };
}
function debounce(func, ms) {
    let timer = null;
    let currentReject = null;
    return function (...rest) {
        // Immediately cancel previous pending call
        if (currentReject) {
            currentReject(new DebouncedException("Function was called again before this one could resolve"));
            if (timer)
                clearTimeout(timer);
        }
        const self = this;
        return new Future((resolve, reject) => {
            currentReject = reject;
            timer = setTimeout(() => {
                currentReject = null;
                timer = null;
                resolve(func.apply(self, rest));
            }, ms);
        });
    };
}
const RESULT_KEY = Symbol('memo_result');
function memo(func) {
    // Always check the registry first for persistent state
    let cache = InternalRegistries.MEMO.get(func);
    if (!cache) {
        cache = new Map();
        InternalRegistries.MEMO.set(func, cache);
    }
    return function (...rest) {
        let current = cache;
        for (const arg of rest) {
            if (!current.has(arg))
                current.set(arg, new Map());
            current = current.get(arg);
        }
        if (current.has(RESULT_KEY))
            return current.get(RESULT_KEY);
        const result = func.apply(this, rest);
        current.set(RESULT_KEY, result);
        return result;
    };
}
//* Date
function atDate(year, monthIndex, date, hours, minutes, seconds, ms) {
    return new Date(year, monthIndex, date, hours, minutes, seconds, ms).getTime();
}
function clone(object, deep = true) {
    if (typeof object === "symbol") {
        throw new CloneException("Symbols cannot be cloned");
    }
    if (!deep) {
        if (Array.isArray(object)) {
            return [...object];
        }
        return { ...object };
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
    const m = this.match(/^(\s*)([a-z])/);
    if (!m ||
        m[0] === undefined ||
        m[1] === undefined ||
        m[2] === undefined) {
        return this;
    }
    return m[1] + m[2].toUpperCase() + this.slice(m[0].length);
}
;
function matches(regexp) {
    if (regexp instanceof RegExp) {
        return regexp.test(this);
    }
    else {
        return this.includes(regexp);
    }
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
function randomRange(minOrMax, max) {
    if (typeof minOrMax !== "undefined" && typeof max !== "undefined") {
        return Math.random() * (max - minOrMax) + minOrMax;
    }
    return Math.random() * minOrMax;
}
;

;// ./package/src/Core/registry.ts
class Registry {
    constructor(container = new Map()) {
        // Instance-related properties and methods
        Object.defineProperty(this, "container", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (container instanceof Map) {
            this.container = container;
        }
        else if (Array.isArray(container)) {
            this.container = new Map(container);
        }
        else {
            this.container = new Map(Object.entries(container));
        }
    }
    get(key) {
        return this.container.get(key);
    }
    set(key, value) {
        if (this.has(key))
            throw new RegistryException("Cannot set a value for a property that already exists");
        this.container.set(key, value);
    }
    has(key) {
        return this.container.has(key);
    }
    setMultiple(obj) {
        for (const [key, value] of obj) {
            this.set(key, value);
        }
        ;
    }
}
class Registries {
}
Object.defineProperty(Registries, "HTML_TAGS", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Registry({
        "a": HTMLAnchorElement,
        "abbr": HTMLElement,
        "address": HTMLElement,
        "area": HTMLAreaElement,
        "article": HTMLElement,
        "aside": HTMLElement,
        "audio": HTMLAudioElement,
        "b": HTMLElement,
        "base": HTMLBaseElement,
        "bdi": HTMLElement,
        "bdo": HTMLElement,
        "blockquote": HTMLQuoteElement,
        "body": HTMLBodyElement,
        "br": HTMLBRElement,
        "button": HTMLButtonElement,
        "canvas": HTMLCanvasElement,
        "caption": HTMLTableCaptionElement,
        "cite": HTMLElement,
        "code": HTMLElement,
        "col": HTMLTableColElement,
        "colgroup": HTMLTableColElement,
        "data": HTMLDataElement,
        "datalist": HTMLDataListElement,
        "dd": HTMLElement,
        "del": HTMLModElement,
        "details": HTMLDetailsElement,
        "dfn": HTMLElement,
        "dialog": HTMLDialogElement,
        "div": HTMLDivElement,
        "dl": HTMLDListElement,
        "dt": HTMLElement,
        "em": HTMLElement,
        "embed": HTMLEmbedElement,
        "fieldset": HTMLFieldSetElement,
        "figcaption": HTMLElement,
        "figure": HTMLElement,
        "footer": HTMLElement,
        "form": HTMLFormElement,
        "h1": HTMLHeadingElement,
        "h2": HTMLHeadingElement,
        "h3": HTMLHeadingElement,
        "h4": HTMLHeadingElement,
        "h5": HTMLHeadingElement,
        "h6": HTMLHeadingElement,
        "head": HTMLHeadElement,
        "header": HTMLElement,
        "hgroup": HTMLElement,
        "hr": HTMLHRElement,
        "html": HTMLHtmlElement,
        "i": HTMLElement,
        "iframe": HTMLIFrameElement,
        "img": HTMLImageElement,
        "input": HTMLInputElement,
        "ins": HTMLModElement,
        "kbd": HTMLElement,
        "label": HTMLLabelElement,
        "legend": HTMLLegendElement,
        "li": HTMLLIElement,
        "link": HTMLLinkElement,
        "main": HTMLElement,
        "map": HTMLMapElement,
        "mark": HTMLElement,
        "menu": HTMLMenuElement,
        "meta": HTMLMetaElement,
        "meter": HTMLMeterElement,
        "nav": HTMLElement,
        "noscript": HTMLElement,
        "object": HTMLObjectElement,
        "ol": HTMLOListElement,
        "optgroup": HTMLOptGroupElement,
        "option": HTMLOptionElement,
        "output": HTMLOutputElement,
        "p": HTMLParagraphElement,
        "picture": HTMLPictureElement,
        "pre": HTMLPreElement,
        "progress": HTMLProgressElement,
        "q": HTMLQuoteElement,
        "rp": HTMLElement,
        "rt": HTMLElement,
        "ruby": HTMLElement,
        "s": HTMLElement,
        "samp": HTMLElement,
        "script": HTMLScriptElement,
        "search": HTMLElement,
        "section": HTMLElement,
        "select": HTMLSelectElement,
        "slot": HTMLSlotElement,
        "small": HTMLElement,
        "source": HTMLSourceElement,
        "span": HTMLSpanElement,
        "strong": HTMLElement,
        "style": HTMLStyleElement,
        "sub": HTMLElement,
        "summary": HTMLElement,
        "sup": HTMLElement,
        "table": HTMLTableElement,
        "tbody": HTMLTableSectionElement,
        "td": HTMLTableCellElement,
        "template": HTMLTemplateElement,
        "textarea": HTMLTextAreaElement,
        "tfoot": HTMLTableSectionElement,
        "th": HTMLTableCellElement,
        "thead": HTMLTableSectionElement,
        "time": HTMLTimeElement,
        "title": HTMLTitleElement,
        "tr": HTMLTableRowElement,
        "track": HTMLTrackElement,
        "u": HTMLElement,
        "ul": HTMLUListElement,
        "var": HTMLElement,
        "video": HTMLVideoElement,
        "wbr": HTMLElement,
    })
});
class registry_InternalRegistries {
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Object.defineProperty(registry_InternalRegistries, "MEMO", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
Object.defineProperty(registry_InternalRegistries, "THROTTLE", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
Object.defineProperty(registry_InternalRegistries, "DEBOUNCE", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});

;// ./package/src/Core/type.ts
var type_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var type_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Type_validator;
class Type {
    constructor(validator) {
        _Type_validator.set(this, void 0);
        type_classPrivateFieldSet(this, _Type_validator, validator, "f");
    }
    static object(shape, fallback) {
        // Define the target type cleanly for our type guard
        return new Type((val) => {
            if (typeof val !== 'object' || val === null)
                return false;
            // 1. Validate the blueprint shape properties
            for (const key in shape) {
                const rule = shape[key];
                const actual = val[key];
                if (rule instanceof Type) {
                    if (!rule.is(actual))
                        return false;
                }
                else if (actual !== rule) {
                    return false;
                }
            }
            for (const key in val) {
                // If the key is not inside the blueprint
                if (!(key in shape)) {
                    if (fallback) {
                        const actualExtra = val[key];
                        if (!fallback[0].is(key))
                            return false;
                        if (!fallback[1].is(actualExtra))
                            return false;
                    }
                    else {
                        return false;
                    }
                }
            }
            return true;
        });
    }
    static of(shape) {
        return this.object(shape);
    }
    static literal(value) {
        return new Type((val) => val === value);
    }
    static array(...types) {
        return new Type((val) => {
            if (!Array.isArray(val))
                return false;
            return val.every(item => types.some(t => t instanceof Type ? t.is(item) : item === t));
        });
    }
    static tuple(...types) {
        return new Type((val) => {
            if (!Array.isArray(val) || val.length !== types.length)
                return false;
            return types.every((t, i) => t instanceof Type ? t.is(val[i]) : val[i] === t);
        });
    }
    static optional(innerType) {
        return new Type((val) => val === undefined || innerType.is(val));
    }
    is(val) {
        return type_classPrivateFieldGet(this, _Type_validator, "f").call(this, val);
    }
}
_Type_validator = new WeakMap();
Object.defineProperty(Type, "STRING", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Type((val) => typeof val === "string")
});
Object.defineProperty(Type, "NUMBER", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Type((val) => typeof val === "number")
});
Object.defineProperty(Type, "BOOLEAN", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Type((val) => typeof val === "boolean")
});
Object.defineProperty(Type, "OBJECT", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Type((val) => typeof val === "object" && val !== null)
});
Object.defineProperty(Type, "UNDEFINED", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Type((val) => typeof val === "undefined")
});
Object.defineProperty(Type, "SYMBOL", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Type((val) => typeof val === "symbol")
});
Object.defineProperty(Type, "NULL", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Type((val) => val === null)
});

;// ./package/src/Core/opti.ts











if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("Opti requires a browser environment.");
}
globalThis.Opti = {
    crafty: false,
    query: false,
    unsync: false,
    requests: false,
    flow: false
};
//! Others may depend on these
globalThis.RegistryException = exceptions_RegistryException;
globalThis.Future = Promise;
globalThis.InternalRegistries = registry_InternalRegistries;
globalThis.Registries = Registries;
globalThis.Type = Type;
globalThis.Exception = Exception;
globalThis.SyntaxException = exceptions_SyntaxException;
globalThis.TypeException = exceptions_TypeException;
globalThis.CloneException = exceptions_CloneException;
globalThis.NumberTooSmallException = exceptions_NumberTooSmallException;
globalThis.NotImplementedException = NotImplementedException;
globalThis.AccessException = AccessException;
globalThis.UnknownException = UnknownException;
globalThis.DebouncedException = exceptions_DebouncedException;
globalThis.AssertionException = AssertionException;
globalThis.FetchException = FetchException;
globalThis.HierarchyException = exceptions_HierarchyException;
globalThis.RuntimeException = RuntimeException;
setReadOnly(globalThis, "f", (iife, args, thisArg) => {
    return iife.apply(thisArg, (args || []));
});
globalThis.is = is;
globalThis.assert = assert;
globalThis.sleep = sleep;
globalThis.isEmpty = isEmpty;
globalThis.Enum = Enum;
globalThis.Tuple = Tuple;
[HTMLDocument, Document].forEach(el => el.prototype.ready = ready);
[HTMLDocument, Document].forEach(el => el.prototype.leaving = leaving);
[HTMLDocument, Document].forEach(el => el.prototype.css = documentCss);
Node.prototype.$ = $;
Node.prototype.$$ = $$;
Node.prototype.cut = cut;
Node.prototype.getParent = getParent; // ChildNode
Node.prototype.getAncestor = getAncestor; // ChildNode
Node.prototype.getChildren = getChildren; // ParentNode
Node.prototype.getSiblings = getSiblings; // ChildNode
Element.prototype.copy = copy;
Element.prototype.txt = txt;
Element.prototype.html = html;
Element.prototype.addClass = addClass;
Element.prototype.removeClass = removeClass;
Element.prototype.toggleClass = toggleClass;
Element.prototype.hasClass = hasClass;
Element.prototype.attr = attr;
HTMLElement.prototype.css = css;
HTMLElement.prototype.show = show;
HTMLElement.prototype.hide = hide;
HTMLElement.prototype.toggle = toggle;
setGetter(HTMLElement.prototype, "isVisible", isVisible);
setGetter(HTMLInputElement.prototype, "val", val);
HTMLFormElement.prototype.serialize = serialize;
NodeList.prototype.addClass = addClassList;
NodeList.prototype.removeClass = removeClassList;
NodeList.prototype.toggleClass = toggleClassList;
HTMLCollection.prototype.addClass = addClassList;
HTMLCollection.prototype.removeClass = removeClassList;
HTMLCollection.prototype.toggleClass = toggleClassList;
String.prototype.remove = remove;
String.prototype.matches = matches;
String.prototype.capitalize = capitalize;
String.prototype.toCase = toCase;
Number.prototype.repeat = repeat;
Function.debounce = debounce;
Function.throttle = throttle;
Function.memo = memo;
Array.prototype.unique = unique;
Array.prototype.chunk = chunk;
Array.prototype.pluck = pluck;
Array.prototype.pluckLast = pluckLast;
Array.prototype.relocate = relocate;
Array.prototype.relocateTo = relocateTo;
Array.prototype.replace = replace;
Array.prototype.sort = sortBy;
Array.prototype.insert = insert;
Math.randomRange = randomRange;
Object.clone = clone;
Object.forEach = forEach;
Date.at = atDate;

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});