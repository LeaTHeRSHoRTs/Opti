declare global {
    namespace Query {
        interface $ {
            <T extends HTMLTag>(selector: T): HTMLElementOf<T> | null;
            <T extends Element = HTMLElement>(selector: string): T | null;

            assert<T extends HTMLTag>(selector: string, tag: T): HTMLElementOf<T> | null;

            tear<T extends HTMLTag>(selector: T): HTMLElementOf<T> | null;
            tear<T extends Element = HTMLElement>(selector: string): T | null;

            explicit<T extends HTMLTag>(selector: string, tag: T): HTMLElementOf<T> | null;
        }

        interface $$ {
            <T extends HTMLTag>(selector: T): Arr<HTMLElementOf<T>>;
            <T extends Element = HTMLElement>(selector: string): Arr<T>;

            assert<T extends HTMLTag>(selector: string, tag: T): Arr<HTMLElementOf<T>>;

            tear<T extends HTMLTag>(selector: T): Arr<HTMLElementOf<T>>;
            tear<T extends Element = HTMLElement>(selector: string): Arr<T>;

            explicit<T extends HTMLTag>(selector: string, tag: T): Arr<HTMLElementOf<T>>;
        }
    }
}

export { };