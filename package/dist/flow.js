(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Flow"] = factory();
	else
		root["Flow"] = factory();
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// ./src/Flow/flowclass.ts
class Flow {
    static flows(fn, flowback) {
        if (!fn) {
            return false;
        }
        return true;
    }
    static flowback(fileOrTest) {
    }
}

;// ./src/Flow/flow.ts

(function () {
    //@ts-ignore
    globalThis.opti.flow = true;
    globalThis.Flow = Flow;
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});