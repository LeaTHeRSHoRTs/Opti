import "@query";
import { _InternalQuery } from "./class";
import * as QueryImpl from "./selectors";


globalThis.$ = QueryImpl.$.bind<Query.$>(document);
globalThis.$$ = QueryImpl.$$.bind<Query.$$>(document);

Node.prototype.$ = function(this: ParentNode, ...args: Func.Arguments< Query.$ >) { return QueryImpl.$.call(this, ...args); };
Node.prototype.$$ = function(this: ParentNode, ...args: Func.Arguments< Query.$ >) { return QueryImpl.$$.call(this, ...args); };

export default _InternalQuery satisfies globalThis.Query;