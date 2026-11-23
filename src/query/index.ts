import '@query';
import * as QueryImpl from './selectors';
import { initializer, placeholderFunc } from '../helpers';

export default initializer<Query>({
    $: QueryImpl.$.bind<Query.$>(document),
    $$: QueryImpl.$$.bind<Query.$$>(document)
}, () => {
    Node.prototype.$ = function(this: ParentNode, ...args: Func.Arguments< Query.$ >) { return QueryImpl.$.call(this, ...args); };
    Node.prototype.$$ = function(this: ParentNode, ...args: Func.Arguments< Query.$ >) { return QueryImpl.$$.call(this, ...args); };
});