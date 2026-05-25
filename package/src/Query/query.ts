import "@query";
import { createModuleError } from "../helpers";
import { Internal_Query } from "./class";
import * as QueryImpl from "./selectors";

(function() {
  if (!Opti) throw createModuleError("query");

  globalThis.Query = Internal_Query;
  globalThis.$ = QueryImpl.$.bind<Query.$>(document);
  globalThis.$$ = QueryImpl.$$.bind<Query.$$>(document);

  Node.prototype.$ = function(this: ParentNode, ...args: Func.Arguments< Query.$ >) { return QueryImpl.$.call(this, ...args); };
  Node.prototype.$$ = function(this: ParentNode, ...args: Func.Arguments< Query.$ >) { return QueryImpl.$$.call(this, ...args); };
})();