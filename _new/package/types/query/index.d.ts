import './query.js';
import './classes.js';
import './exceptions.js';

declare global {
    interface Query {
        $: Query.$;
        $$: Query.$$;
    }
    
    /**
     * The query export, used for accessing $ and $$
     * @opti
     * @since 1.0.0
     */
    var Query: Query;
}

export const Query: Query;