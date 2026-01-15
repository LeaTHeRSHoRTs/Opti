(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Crafty"] = factory();
	else
		root["Crafty"] = factory();
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// ./src/Crafty/nodes.ts
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
class Node {
    constructor(children) {
        this.children = children !== null && children !== void 0 ? children : [];
    }
    append(child) {
        this.children.push(child);
    }
    prepend(child) {
        this.children.unshift(child);
    }
    appendTo(node) {
        node.children.push(this);
    }
    prependTo(node) {
        node.children.push(this);
    }
    getElementById(id) {
        return this.children.find(child => child.id === id);
    }
    getElementsByClassName(className) {
        function search(list) {
            let results = [];
            for (const item of list) {
                if (Array.isArray(item)) {
                    results = results.concat(search(item));
                }
                else {
                    const cls = item.classList;
                    if (typeof cls === "string" && cls === className) {
                        results.push(item);
                    }
                    else if (Array.isArray(cls) && cls.includes(className)) {
                        results.push(item);
                    }
                }
            }
            return results;
        }
        return search(this.children);
    }
    getElementsByTagName(tag) {
        function search(list) {
            let results = [];
            for (const item of list) {
                if (Array.isArray(item)) {
                    results = results.concat(search(item));
                }
                else {
                    if (item.tagName === tag) {
                        results.push(item);
                    }
                    if (item.children) {
                        results = results.concat(search(item.children));
                    }
                }
            }
            return results;
        }
        return search(this.children);
    }
}
class Element extends Node {
    constructor(tag, props = {}, children) {
        var _a;
        super(children !== null && children !== void 0 ? children : []);
        this.tag = tag;
        this.classList = ((_a = props.classes) !== null && _a !== void 0 ? _a : []);
        this.props = f(() => {
            const { css } = props, otherProps = __rest(props, ["css"]);
            return otherProps;
        });
        this.internalCss = f(() => {
            var _a;
            const styles = document.createElement("div").style;
            Object.forEach((_a = props.css) !== null && _a !== void 0 ? _a : {}, (k, v) => {
                if (v !== undefined && v !== null && k !== "length") {
                    styles[k] = v.toString();
                }
            });
            return styles;
        });
        if (!this.props.classes) {
            //@ts-ignore
            this.props.classes = new Array();
        }
        assert(this.props.classes !== undefined);
    }
    get(prop) {
        return this.props[prop];
    }
    set(prop, value) {
        this.props[prop] = value;
    }
    normalize() {
        const el = document.createElement(this.tag);
        Object.entries(this.props).forEach(([key, value]) => {
            el.setAttribute(key, Array.isArray(value) ? value.join(" ") : value);
        });
        el.append(...this.children);
        return el;
    }
    wrap(element) {
        return Crafty.craft(element, {}, [this]);
    }
    get id() {
        return this.props.id;
    }
    getClasses() {
        return this.props.classes;
    }
    addClass(cls) {
        var _a;
        (_a = this.props.classes) === null || _a === void 0 ? void 0 : _a.push(cls);
    }
}
;
class Fragment extends Node {
    get(prop) {
        throw new NotImplementedException("function `get` does not work on object of type `Crafty.Fragment`");
    }
    set(prop) {
        throw new NotImplementedException("function `set` does not work on object of type `Crafty.Fragment`");
    }
    normalize() {
        const frag = document.createDocumentFragment();
        const subchildren = this.children.map((v) => v.render());
        for (const child of subchildren) {
            frag.append(child);
        }
        ;
        return frag;
    }
    wrap(element) {
        return Crafty.craft(element, {}, [this]);
    }
}
;

;// ./src/Crafty/class.ts

class class_Crafty {
    constructor() { }
    static craft(tagOrChildList, propsOrChild, children) {
        if (typeof tagOrChildList === "string") {
            return new class_Crafty.Element(tagOrChildList, propsOrChild, children);
        }
        else {
            return new class_Crafty.Fragment(tagOrChildList);
        }
    }
    static from(element) {
        if (typeof element === "string") {
            return new class_Crafty.Unknown(element);
        }
        else if (element instanceof DocumentFragment) {
            return new class_Crafty.Unknown(element.children);
        }
        return new class_Crafty.Unknown(element.tagName, {}, element.children);
    }
}
class_Crafty.Node = Node;
class_Crafty.Element = Element;
class_Crafty.Fragment = Fragment;
class_Crafty.Unknown = class Unknown {
    constructor(...data) {
        this.data = data;
    }
};

;// ./src/Crafty/crafty.ts

(function () {
    // @ts-ignore
    globalThis.Crafty = class_Crafty;
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});