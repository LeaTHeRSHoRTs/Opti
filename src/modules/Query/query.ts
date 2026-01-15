import * as Query from "./selectors";

(function() {
  globalThis.$ = Query.$;
  globalThis.$$ = Query.$$;
})();