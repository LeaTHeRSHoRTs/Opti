import './crafty.js';
import './basicnodes.js';
import './elements.js';
import './exceptions.js';
import './documentalias.js';

declare global {
    interface Crafty {
        craft<T extends VoidHTMLTag, U extends Crafty.Props<T> = {}>(
            el: T,
            props?: U
        ): Crafty.VoidHTMLElement<T, U>;
        craft<T extends Crafty.NormalHTMLTag, U extends Crafty.Props<T> = {}>(
            el: T,
            props?: U,
            children?: Crafty.Node[]
        ): Crafty.HTMLElement<T, U>;
        craft<N extends Crafty.Namespace, T extends Crafty.TagFromNamespace<N>, U extends Crafty.Props<T> = {}>(
            namespace: N,
            el: T,
            props?: U,
            children?: Crafty.Node[]
        ): Crafty.Element<N, T, U>;
        craft(...children: Arr.Present<Crafty.Node>): Crafty.Fragment;
        craft(type: Crafty.TEXT, str: string): Crafty.Text;
        craft(type: typeof Crafty.HTML, html: string): Crafty.HTML;
        craft(type: Crafty.COMMENT, comment: string): Crafty.Comment;

        /**
         * Crafts a Node from a HTML string
         * @opti
         */
        from(html: string): Crafty.Node;

        /**
         * Crafts an Element from a DOM Element
         * @opti
         */
        from(el: Element): Crafty.Element;

        /**
         * Crafts a HTMLElement from a DOM HTMLElement
         * @opti
         */
        from<T extends HTMLTag>(el: HTMLElementOf<T>): Crafty.HTMLElement<T>;

        /**
         * Crafts a Node from a DOM Node
         * @opti
         */
        from<T extends Crafty.Node>(node: T): T;

        isElement(node: unknown): node is Crafty.Element;
        isHTMLElement(node: unknown): node is Crafty.HTMLElement;
        isVoidHTMLElement(node: unknown): node is Crafty.VoidHTMLElement;
        isText(node: unknown): node is Crafty.Text;
        isFragment(node: unknown): node is Crafty.Fragment;
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
export declare const Crafty: Crafty;