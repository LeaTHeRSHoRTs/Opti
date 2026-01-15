(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Query"] = factory();
	else
		root["Query"] = factory();
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// ./src/Query/selectors.ts
class MalformedQueryException extends Exception {
    constructor() {
        super(...arguments);
        this.name = "MalformedQueryException";
    }
}
function parseQuery(str) {
    const complete = {};
    function set(el, prop, value) {
        complete[el][prop] = value;
    }
    function replace(regex, filter) {
        str = str.replace(regex, (_, ...inner) => {
            var _a;
            return (_a = filter(...inner)) !== null && _a !== void 0 ? _a : "";
        });
    }
    str = str.trim();
    // ::before
    replace(/(.+?)::before$/, (...inner) => {
        set(inner[0], "before", true);
    });
    // ::after
    replace(/(.+?)::after$/, (...inner) => {
        set(inner[0], "before", true);
    });
    replace(/(.+?):parent/g, (...inner) => {
        set(inner[0], "parent", true);
    });
    // :this-first-child
    replace(/(.+?):this-first-child/g, (...inner) => {
        set(inner[0], "thisfirstchild", true);
    });
    // :this-last-child
    replace(/(.+?):this-last-child/g, (...inner) => {
        set(inner[0], "thislastchild", true);
    });
    // :this-nth-child
    replace(/(.+?):this-nth-child(\d+)/g, (...inner) => {
        set(inner[0], "thisnthchild", Number(inner[1]));
    });
    // :inline-style(...styles)
    replace(/(.+?):inline-style\(([\w]+[=:][\w\d];?)+\)/g, (...inner) => {
        const selector = inner[0]; // selector
        const inners = inner[1].split(",").map(v => v.trim()); // ...:inline-style([...styles])
        const expanded = inners.map(style => `[style*=${style}]`).join("");
        return expanded;
    });
    // :external-style(...styles)
    replace(/(.+?):external-style\(([\w]+[=:][\w\d]\w*;?\w*)+\)/g, (...inner) => {
        set(inner[0], "styleexternal", inner[1].split(";").map(s => s.trim()));
    });
    // :style(...styles)
    replace(/(.+?):style\(([\w]+[=:][\w\d]\w*;?\w*)+\)/g, (...inner) => {
        set(inner[0], "styles", inner[1].split(";").map(s => s.trim()));
    });
    // :hasText(...text)
    replace(/(.+?):hasText\(([^)(]+)\)/g, (...inner) => {
        set(inner[0], "hasText", inner[1].split(",").map(v => v.trim()).filter(Boolean));
    });
    // :has(...selectors)
    replace(/(.+?):has\(([^)]+)\)/g, (...inner) => {
        const selector = inner[0]; // selector
        const inners = inner[1].split(",").map(v => v.trim()); // ...:has([...selectors])
        const expanded = inners.map(child => `${selector} > ${child}`).join(", ");
        return `:is(${expanded})`;
    });
    // :hidden
    replace(/(.+?):hidden/g, (...inner) => {
        set(inner[0], "hidden", true);
        return "";
    });
    // :visible
    replace(/(.+?):visible/g, (...inner) => {
        set(inner[0], "visible", true);
    });
    // :event(...events)
    replace(/(.+?):event\(([a-z,\s]*)\)/g, (...inner) => {
        set(inner[0], "event", inner[1].split(",").map(v => v.trim()).filter(Boolean));
    });
    return [str, complete];
}
const _$ = (selector) => {
    const [res, checks] = parseQuery(selector);
    const collection = Collection.from(document.querySelectorAll(res));
    if ((collection === null || collection === void 0 ? void 0 : collection.length) <= 0)
        return null;
    for (const el of collection) {
        for (const [el, check] of Object.entries(checks)) {
            throw new NotImplementedException();
        }
        //* :event(...ev)
        if (checks.event && (el.event || !Object.keys(checks.event).every(ev => { var _a; return (_a = el.event) === null || _a === void 0 ? void 0 : _a.includes(ev); }))) {
            continue;
        }
        //* :hidden, :visible
        if (checks.hidden || checks.visible) {
            const display = el.css("display") || getComputedStyle(el).display;
            const visibility = el.css("visibility") || getComputedStyle(el).visibility;
            const opacity = el.css("opacity") || getComputedStyle(el).opacity;
            // If any of these are NOT hiding the element, continue (skip)
            const status = (display !== "none" || visibility !== "hidden" || opacity !== "0") ? "visible" : "hidden";
            if (checks.hidden && status !== "hidden")
                continue;
            if (checks.visible && status !== "visible")
                continue;
        }
        if (checks.hasText) {
        }
        return el;
    }
    return null;
};
_$.query = () => new QueryBuilder(false);
_$.assert = function (selector) {
    return (tag) => {
        return document.querySelector(selector);
    };
};
_$.all = function (selector) {
    throw new NotImplementedException();
};
_$.tear = (selector) => {
    throw new NotImplementedException();
};
_$.explicit = (selector) => {
    return (tag) => document.querySelector(selector);
};
_$.with = (selector) => {
    throw new NotImplementedException();
};
const $ = _$;
const _$$ = (selector) => {
    return Collection.from(document.querySelectorAll(selector));
};
_$$.all = function (selector) {
    return Collection.of([new HTMLElement(), new HTMLElement()]);
};
_$$.assert = function (selector) {
    return (tag) => {
        return Collection.from(document.querySelectorAll(selector));
    };
};
_$$.query = () => new QueryBuilder(true);
_$$.explicit = (selector) => {
    return (tag) => Collection.from(document.querySelectorAll(selector));
};
_$$.live = (selecor) => {
    throw new NotImplementedException();
};
_$$.with = (selecor) => {
    throw new NotImplementedException();
};
_$$.tear = (selector) => {
    throw new NotImplementedException();
};
const $$ = _$$;
class QueryBuilder {
    constructor(multi) {
        this.multi = multi;
        this.queryString = [];
    }
    is(selector) {
        this.queryString.push(`:is(${selector})`);
        return this;
    }
    isnt(selector) {
        this.queryString.push(`:not(${selector})`);
        return this;
    }
}

;// ./src/Query/query.ts

(function () {
    globalThis.$ = $;
    globalThis.$$ = $$;
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});