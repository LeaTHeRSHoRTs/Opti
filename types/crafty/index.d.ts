import './crafty.js';
import './basicnodes.js';
import './elements.js';
import './exceptions.js';
import './documentalias.js';

declare global {
    interface Crafty {
        /**
         *
         * @param el
         * @param props
         * @example
         */
        craft<T extends VoidHTMLTag, U extends Crafty.Props<T> = {}>(
            el: T,
            props?: U
        ): Crafty.VoidHTMLElement<T, U>;
        /**
         *
         * @param el
         * @param props
         * @param children
         * @example
         */
        craft<T extends Crafty.NormalHTMLTag, U extends Crafty.Props<T> = {}>(
            el: T,
            props?: U,
            children?: Crafty.Node[]
        ): Crafty.HTMLElement<T, U>;
        /**
         *
         * @param namespace
         * @param el
         * @param props
         * @param children
         * @example
         */
        craft<N extends Crafty.Namespace, T extends Crafty.TagFromNamespace<N>, U extends Crafty.Props<T> = {}>(
            namespace: N,
            el: T,
            props?: U,
            children?: Crafty.Node[]
        ): Crafty.Element<N, T, U>;
        /**
         *
         * @param {...any} children
         * @example
         */
        craft(...children: Arr.Present<Crafty.Node>): Crafty.Fragment;
        /**
         *
         * @param type
         * @param str
         * @example
         */
        craft(type: Crafty.TEXT, str: string): Crafty.Text;
        /**
         *
         * @param type
         * @param html
         * @example
         */
        craft(type: typeof Crafty.HTML, html: string): Crafty.HTML;
        /**
         *
         * @param type
         * @param comment
         * @example
         */
        craft(type: Crafty.COMMENT, comment: string): Crafty.Comment;

        /**
         * Crafts a Node from a HTML string
         * @opti
         * @param html
         * @example
         */
        from(html: string): Crafty.Node;

        /**
         * Crafts an Element from a DOM Element
         * @opti
         * @param el
         * @example
         */
        from(el: Element): Crafty.Element;

        /**
         * Crafts a HTMLElement from a DOM HTMLElement
         * @opti
         * @param el
         * @example
         */
        from<T extends HTMLTag>(el: HTMLElementOf<T>): Crafty.HTMLElement<T>;

        /**
         * Crafts a Node from a DOM Node
         * @opti
         * @param node
         * @example
         */
        from<T extends Crafty.Node>(node: T): T;

        /**
         *
         * @param node
         * @example
         */
        isElement(node: unknown): node is Crafty.Element;
        /**
         *
         * @param node
         * @example
         */
        isHTMLElement(node: unknown): node is Crafty.HTMLElement;
        /**
         *
         * @param node
         * @example
         */
        isVoidHTMLElement(node: unknown): node is Crafty.VoidHTMLElement;
        /**
         *
         * @param node
         * @example
         */
        isText(node: unknown): node is Crafty.Text;
        /**
         *
         * @param node
         * @example
         */
        isFragment(node: unknown): node is Crafty.Fragment;
        /**
         *
         * @param node
         * @example
         */
        isComment(node: unknown): node is Crafty.Comment;

        // Exceptions
        Exception: Crafty.ErrorConstructor;
        ChildrenNotAllowedException: Crafty.ChildrenNotAllowedErrorConstructor;
        NormalizationException: Crafty.NormalizationErrorConstructor;

        readonly COMMENT: unique symbol;
        readonly TEXT: unique symbol;
        readonly HTML: unique symbol;
    }
}
export /**
 *
 */
declare const Crafty: Crafty;