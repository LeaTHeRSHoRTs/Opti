declare global {
    namespace Crafty {
        interface Node {
            readonly kind: Crafty.NodeKind;
            /**
             *
             * @example
             */
            parent(): Node | null;
            /**
             *
             * @param onMount
             * @example
             */
            normalize(onMount?: (node: globalThis.Node) => void): globalThis.Node;
            /**
             *
             * @param tag
             * @example
             */
            wrap<U extends HTMLTag>(tag: U): HTMLElement<U, {}>;
            /**
             *
             * @param namespace
             * @param tag
             * @example
             */
            wrap<N extends Namespace, U extends TagFromNamespace<N>>(namespace: N, tag: U): Element<N, U, {}>;
            /**
             *
             * @example
             */
            clone(): this;
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
            txt(fn: (original: string) => string): void;
        }

        interface Parent<T extends Node = Node> {
            /**
             *
             * @example
             */
            children(): T[];
            /**
             *
             * @param child
             * @example
             */
            append(child: T): void;
            /**
             *
             * @param child
             * @example
             */
            prepend(child: T): void;
        }

        interface Fragment extends Node, Parent {
            readonly kind: 'fragment';
            /**
             *
             * @param onMount
             * @example
             */
            normalize(onMount?: (node: globalThis.DocumentFragment) => void): globalThis.DocumentFragment;
            /**
             *
             * @example
             */
            isEmpty(): this is Fragment & { children: [] };
        }

        interface Html extends Node {
            /**
             *
             * @example
             */
            html(): string;
        }

        interface Text extends Html {
            readonly kind: 'text';
            readonly length: number;
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
            normalize(onMount?: (node: globalThis.Text) => void): globalThis.Text;
        }

        interface Comment extends Node, Parent<Text> {
            readonly kind: 'comment';
            /**
             *
             * @param onMount
             * @example
             */
            normalize(onMount?: (node: globalThis.Comment) => void): globalThis.Comment;
        }
    }
}

export { };