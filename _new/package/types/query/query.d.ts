declare global {
    namespace Query {
        interface $ {
            <T extends HTMLTag>(selector: T): HTMLElementOf<T> | null;
            (selector: string): HTMLElement | null;

            assert<T extends HTMLTag>(selector: string, tag: T): HTMLElementOf<T> | null;

            tear<T extends HTMLTag>(selector: T): HTMLElementOf<T> | null;
            tear(selector: string): HTMLElement;

            explicit<T extends HTMLTag>(selector: string, tag: T): HTMLElementOf<T> | null;
        }

        interface $$ {
            <T extends HTMLTag>(selector: T): HTMLElementOf<T>[];
            (selector: string): HTMLElement[];

            assert(selector: string): <T extends HTMLTag>(tag: T) => HTMLElementOf<T>[];

            tear<T extends HTMLTag>(selector: T): HTMLElementOf<T>[];
            tear(selector: string): HTMLElement[];

            explicit<T extends HTMLTag>(selector: string, tag: T): HTMLElementOf<T>[];
        }
    }
}

export { };