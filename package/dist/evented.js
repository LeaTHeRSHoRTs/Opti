(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Evented"] = factory();
	else
		root["Evented"] = factory();
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// ./src/Evented/events.ts
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Thread_instances, _Thread_then;
class Evented {
    constructor() {
        this._evmap = {};
    }
    on(ev, callback) {
        var _a;
        const map = (_a = this._evmap) !== null && _a !== void 0 ? _a : [];
        map[ev] = [...(map[ev] || []), callback];
    }
    off(ev) {
        delete this._evmap[ev];
    }
    emit(ev, ...args) {
        const callbacks = this._evmap[ev];
        if (callbacks) {
            for (const cb of callbacks) {
                cb(...args);
            }
        }
    }
}
class ThreadTerminatedException extends globalThis.Exception {
    constructor(code) {
        super("ThreadTerminatedException", code === null || code === void 0 ? void 0 : code.toString());
    }
}
function addEventRuled(type, 
//@ts-ignore
listener, timesOrCondition, options) {
    if (typeof timesOrCondition === "number") {
        if (timesOrCondition <= 0)
            return;
        let repeatCount = timesOrCondition; // Default to 1 if no repeat option provided
        const onceListener = (event) => {
            listener.call(this, event);
            repeatCount--;
            if (repeatCount <= 0) {
                this.removeEventListener(type, onceListener, options);
            }
        };
        this.addEventListener(type, onceListener, options);
    }
    else {
        if (timesOrCondition.call(this))
            return;
        const onceListener = (event) => {
            if (timesOrCondition.call(this)) {
                this.removeEventListener(type, onceListener, options);
                return;
            }
            listener.call(this, event);
        };
        this.addEventListener(type, onceListener, options);
    }
}
;
function addEventListeners(listenersOrTypes, callback, options) {
    if (Array.isArray(listenersOrTypes)) {
        for (const type of listenersOrTypes) {
            this.addEventListener(String(type), callback, options);
        }
    }
    else {
        for (const [event, listener] of Object.entries(listenersOrTypes)) {
            if (listener) {
                this.addEventListener(String(event), listener, options);
            }
        }
    }
}
;
function delegateEventListener(type, delegator, listener, options) {
    this.addEventListener(type, function (e) {
        const target = e.target;
        if (!target)
            return;
        let selector;
        if (typeof delegator === "string") {
            selector = delegator;
        }
        else {
            selector = ""; // fallback
        }
        const matchedEl = target.closest(selector);
        if (matchedEl &&
            (!(this instanceof Element) || this.contains(matchedEl))) {
            listener.call(matchedEl, e);
        }
    }, options);
}
function addEventController(type, listener, options) {
    this.addEventListener(type, listener, options);
    const self = this;
    const controller = new class {
        constructor() {
            this._exists = true;
        }
        exists() {
            return this._exists;
        }
        on() {
            self.addEventListener(type, listener, options);
        }
        off() {
            self.removeEventListener(type, listener, options);
        }
        del() {
            delete this.off;
            delete this.on;
            delete this.del;
            this._exists = false;
        }
    };
    return controller;
}
class Thread {
    constructor(initialValue, ...fn) {
        _Thread_instances.add(this);
        this._controller = new AbortController();
        this._signal = this._controller.signal;
        this._running = true;
        this._terminated = false;
        this._sleep = false;
        this._functions = fn;
        this._thread = new Promise((res, rej) => {
            if (this._signal.aborted) {
                rej();
            }
            else {
                res(this._functions[0](initialValue));
            }
        });
        this._functions.shift(); // Remove the function already in the queue
        for (const func of this._functions) {
            __classPrivateFieldGet(this, _Thread_instances, "m", _Thread_then).call(this, func);
        }
    }
    sleep(ms) {
        this._sleep = ms;
    }
    stack(fn) {
        __classPrivateFieldGet(this, _Thread_instances, "m", _Thread_then).call(this, fn);
    }
    pause() {
        this._running = false;
    }
    resume() {
        this._running = true;
    }
    terminate(code) {
        this._controller.abort();
        throw new ThreadTerminatedException(code);
    }
    get running() {
        return this._running;
    }
}
_Thread_instances = new WeakSet(), _Thread_then = function _Thread_then(func) {
    this._thread = this._thread.then(val => new Promise((resolve, reject) => {
        const waitUntilRunning = () => {
            if (this._running) {
                if (this._signal.aborted) {
                    return reject();
                }
                else if (this._sleep) {
                    setTimeout(() => {
                        this._sleep = false;
                        resolve(func(val));
                    }, this._sleep);
                }
                else {
                    resolve(func(val));
                }
            }
            else {
                setTimeout(waitUntilRunning, 50);
            }
        };
        waitUntilRunning();
        // Listen for abort signal
        this._signal.addEventListener('abort', () => reject());
    }));
};
function addEventListenerEnum(type, listener, options) {
    for (const el of this) {
        if (el instanceof Element) {
            el.addEventListener(type, listener, options);
        }
    }
}

;// ./src/Evented/evented.ts

(function () {
    globalThis.Evented = Evented;
    globalThis.Thread = Thread;
    HTMLCollection.prototype.addEventListener = addEventListenerEnum;
    NodeList.prototype.addEventListener = addEventListenerEnum;
    EventTarget.prototype.addBoundListener = addEventRuled;
    EventTarget.prototype.addEventListeners = addEventListeners;
    EventTarget.prototype.delegateEventListener = delegateEventListener;
    EventTarget.prototype.addEventController = addEventController;
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});