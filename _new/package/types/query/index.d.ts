import './query.js';
import './classes.js';
import './exceptions.js';

interface Query {
    $: Query.$;
    $$: Query.$$;
}

declare global {
    /**
     * The query export, used for accessing $ and $$
     * @opti
     * @since 1.0.0
     */
    var Query: Query;
}

export const Query: Query;