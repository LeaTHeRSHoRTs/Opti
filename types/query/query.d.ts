declare global {
    namespace Query {
        interface $ {
            <T extends HTMLTag>(selector: T): HTMLElementOf<T> | null;
            <T extends Element = HTMLElement>(selector: string): T | null;

            /**
             *
             * @param selector
             * @param tag
             * @example
             */
            assert<T extends HTMLTag>(selector: string, tag: T): HTMLElementOf<T> | null;

            /**
             *
             * @param selector
             * @example
             */
            tear<T extends HTMLTag>(selector: T): HTMLElementOf<T> | null;
            /**
             *
             * @param selector
             * @example
             */
            tear<T extends Element = HTMLElement>(selector: string): T | null;

            /**
             *
             * @param selector
             * @param tag
             * @example
             */
            explicit<T extends HTMLTag>(selector: string, tag: T): HTMLElementOf<T> | null;
        }

        interface $$ {
            <T extends HTMLTag>(selector: T): Arr<HTMLElementOf<T>>;
            <T extends Element = HTMLElement>(selector: string): Arr<T>;

            /**
             *
             * @param selector
             * @param tag
             * @example
             */
            assert<T extends HTMLTag>(selector: string, tag: T): Arr<HTMLElementOf<T>>;

            /**
             *
             * @param selector
             * @example
             */
            tear<T extends HTMLTag>(selector: T): Arr<HTMLElementOf<T>>;
            /**
             *
             * @param selector
             * @example
             */
            tear<T extends Element = HTMLElement>(selector: string): Arr<T>;

            /**
             *
             * @param selector
             * @param tag
             * @example
             */
            explicit<T extends HTMLTag>(selector: string, tag: T): Arr<HTMLElementOf<T>>;
        }
    }
}

export { };