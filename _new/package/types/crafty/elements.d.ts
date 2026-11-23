declare global {
    namespace Crafty {
        interface Element<
            N extends Namespace = Namespace,
            T extends TagFromNamespace<N> = TagFromNamespace<N>,
            P extends Props<T> = Props<T>
        > extends Node, Parent {
            readonly kind: 'element' | HTMLTag;
            classList: P['classes'] | [];
            readonly namespaceURI: N;

            /**
             *
             * @param prop
             * @example
             */
            attr<K extends Exclude<keyof P, 'css'>>(prop: K): P[K];
            /**
             *
             * @param prop
             * @param value
             * @example
             */
            attr<K extends Exclude<keyof P, 'css'>>(prop: K, value: P[K]): void;

            /**
             *
             * @example
             */
            txt(): string;
            /**
             *
             * @param text
             * @example
             */
            txt(text: string): void;
            /**
             *
             * @param fn
             * @example
             */
            txt(fn: (origin: string) => string): void;

            /**
             *
             * @param onMount
             * @example
             */
            normalize(onMount?: (node: globalThis.Element) => void): globalThis.Element;
        }

        interface HTMLElement<T extends HTMLTag = HTMLTag, P extends Props<T> = Props<T>> extends Element<'html', T, P>, Parent {
            kind: T;

            /**
             *
             * @example
             */
            css(): P['css'];
            /**
             *
             * @param key
             * @example
             */
            css<K extends keyof P['css']>(key: K): P['css'][K];
            /**
             *
             * @param key
             * @param value
             * @example
             */
            css<K extends keyof P['css'], V extends P['css'][K]>(key: K, value: V): void;

            /**
             *
             * @param onMount
             * @example
             */
            normalize(onMount?: (node: HTMLElementOf<T>) => void): HTMLElementOf<T>;
        }

        interface VoidHTMLElement<T extends VoidHTMLTag = VoidHTMLTag, P extends Props<T> = Props<T>> extends HTMLElement<T, P> {
            kind: T;
            /**
             *
             * @param child
             * @example
             */
            append(child: Node): never;
            /**
             *
             * @param child
             * @example
             */
            prepend(child: Node): never;
        }
    }
}

export { };