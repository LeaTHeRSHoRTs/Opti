///<reference path="./crafty.d.ts" />
///<reference path="./basicnodes.d.ts" />
///<reference path="./elements.d.ts" />
///<reference path="./exceptions.d.ts" />

interface Crafty {
  /**
   * Crafts a HTMLElement that cannot have children
   */
  craft<T extends VoidHTMLTag, U extends Crafty.Props<T> = {}>(el: T, props?: U, children?: Crafty.Node[] ): Crafty.VoidHTMLElement<T, U>;

  /**
   * Crafts a HTMLElement that can have children
   */
  craft<T extends Exclude<HTMLTag, VoidHTMLTag>, U extends Crafty.Props<T> = {}>(el: T, props?: U, children?: Crafty.Node[] ): Crafty.HTMLElement<T, U>;

  /**
   * Crafts an Element from any of the namespaces
   */
  craft<N extends Crafty.Namespace, T extends Crafty.TagFromNamespace<N>, U extends Crafty.Props<T> = {}>(namespace: N, el: T, props?: U, children?: Crafty.Node[] ): Crafty.Element<N, T, U>;

  /**
   * Crafts a Fragment
   */
  craft(...children: Crafty.Node[] ): Crafty.Fragment;

  /**
   * Crafts a Text node
   */
  craft(str: string): Crafty.Text;

  /**
   * Crafts a Node from a HTML string
   */
  from(html: string): Crafty.Node;

  /**
   * Crafts an Element from a DOM Element
   */
  from(el: Element): Crafty.Element;

  /**
   * Crafts a HTMLElement from a DOM HTMLElement
   */
  from<T extends HTMLTag>(el: HTMLElementOf<T>): Crafty.HTMLElement<T>;

  /**
   * Crafts a Node from a DOM Node
   */
  from<T extends Crafty.Node>(node: T): T;

  isElement(node: unknown): node is Crafty.Element;
  isHTMLElement(node: unknown): node is Crafty.HTMLElement;
  isVoidHTMLElement(node: unknown): node is Crafty.VoidHTMLElement;
  isText(node: unknown): node is Crafty.Text;
  isFragment(node: unknown): node is Crafty.Fragment;
  isComment(node: unknown): node is Crafty.Comment;

  // Exceptions
  Exception: Crafty.ExceptionConstructor;
  ChildrenNotAllowedException: Crafty.ChildrenNotAllowedExceptionConstructor;
  NormalizationException: Crafty.NormalizationExceptionConstructor;
}

declare var Crafty: Crafty;