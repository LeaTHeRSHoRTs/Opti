import * as Impl from "./requestfunc";

(function() {
  globalThis.request = Impl.request;
})();