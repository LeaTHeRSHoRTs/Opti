import '@query';
import * as QueryImpl from './selectors';
import { initializer, placeholderFunc } from '../helpers';

export default initializer<Query>(placeholderFunc(), () => {
    globalThis.$ = QueryImpl.$.bind<Query.$>(document);
    globalThis.$$ = QueryImpl.$$.bind<Query.$$>(document);

    Node.prototype.$ = function(this: ParentNode, ...args: Func.Arguments< Query.$ >) { return QueryImpl.$.call(this, ...args); };
    Node.prototype.$$ = function(this: ParentNode, ...args: Func.Arguments< Query.$ >) { return QueryImpl.$$.call(this, ...args); };
});