(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Requests"] = factory();
	else
		root["Requests"] = factory();
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// ./src/Requests/requestfunc.ts
const _request = (typeOrUrl, urlOrData, dataOrOptions, options) => {
    throw new globalThis.NotImplementedException();
};
_request.post = (url, data, options) => {
    throw new globalThis.NotImplementedException();
};
_request.get = (url, data, options) => {
    throw new globalThis.NotImplementedException();
};
_request.json = (type, url, data, options) => {
    throw new globalThis.NotImplementedException();
};
_request.xml = (type, url, data, options) => {
    throw new globalThis.NotImplementedException();
};
_request.css = (type, url, data, options) => {
    throw new globalThis.NotImplementedException();
};
_request.text = (type, url, data, options) => {
    throw new globalThis.NotImplementedException();
};
_request.of = (datatype, method, url, data, options) => {
    throw new globalThis.NotImplementedException();
};
const request = _request;

;// ./src/Requests/requests.ts

(function () {
    globalThis.request = request;
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});