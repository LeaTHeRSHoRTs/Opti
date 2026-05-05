/// <reference path="../../../types/modules/Query/query.lib.d.ts" />

import { declare, OptiModuleError } from "../helpers/helpers";
import { Internal_Query } from "./class";
import * as QueryImpl from "./selectors";

declare(function() {
  if (!Opti) throw new OptiModuleError("query");

  this.Query = Internal_Query;
  this.$ = QueryImpl.$.bind<Query.$>(document);
  this.$$ = QueryImpl.$$.bind<Query.$$>(document);

  Node.prototype.$ = function(this: ParentNode, ...args: Func.Arguments< Query.$ >) { return QueryImpl.$.call(this, ...args); };
  Node.prototype.$$ = function(this: ParentNode, ...args: Func.Arguments< Query.$ >) { return QueryImpl.$$.call(this, ...args); };
});