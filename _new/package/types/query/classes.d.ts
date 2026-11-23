declare global {
    namespace Query {
        interface PseudoElement {
            /**
             *
             * @example
             */
            css(): CSS.Object;
            /**
             *
             * @param prop
             * @example
             */
            css(prop: CSS.PropertyName): string | number | undefined;

            /**
             *
             * @example
             */
            exists(): boolean;
        }
    }
}

export { };