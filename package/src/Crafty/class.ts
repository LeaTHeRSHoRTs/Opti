/// <reference path="../../../types/modules/Crafty/crafty.lib.d.ts" />

import Internal_Node from "./node";

import { isHTMLTag } from "./helpers";
import Internal_Exception, { Internal_ChildrenNotAllowedException, Internal_NormalizationError } from "./exceptions";

import Internal_Text from "./text";
import Internal_Unknown from "./unknown";
import Internal_Fragment from "./fragment";
import { Internal_Element, Internal_HTMLElement, Internal_VoidHTMLElement } from "./element";
import { Internal_Comment } from "./comment";

export class Internal_Crafty {
  private constructor() {}
  public static craft<T extends HTMLTag, U extends Crafty.Props<T> = {}, V extends Crafty.Children = []>(
    el: T,
    props?: U,
    children?: V
  ): Crafty.HTMLElement<T, U>;
  public static craft<N extends Crafty.Namespace, T extends Crafty.TagFromNamespace<N>, U extends Crafty.Props<T> = {}, V extends Crafty.Children = []>(
    namespace: N,
    el: T,
    props?: U,
    children?: V
  ): Crafty.Element<N, T, U>;
  public static craft<T extends Crafty.Children>(...children: T): Crafty.Fragment;
  public static craft(str: string): Crafty.Text;
  public static craft(
    arg: string | Crafty.Node,
    propsOrChild?: Crafty.Props<string> | Crafty.Node,
    childrenOrMore?: Crafty.Node | Crafty.Children,
    ...moreChildren: Crafty.Children
  ): Crafty.Node {
    if (typeof arg === 'string' && propsOrChild === undefined) {
      return new Internal_Text(arg);
    }

    if (typeof arg === 'string' && isHTMLTag(arg) && moreChildren.length === 0) {
      return new Internal_HTMLElement(
        arg,
        propsOrChild as Crafty.Props<HTMLTag>,
        childrenOrMore as Crafty.Children
      );
    }

    if (typeof arg === 'string' && moreChildren.length === 0) {
      const namespace = arg as Crafty.Namespace;
      const el = propsOrChild as unknown as Crafty.TagFromNamespace<typeof namespace>;
      const props = childrenOrMore as Crafty.Props<typeof el>;
      return new Internal_Element(namespace, el, props, []);
    }

    return new Internal_Fragment(
      ...([arg as Crafty.Node, propsOrChild as Crafty.Node, childrenOrMore as Crafty.Node, ...moreChildren].filter(
        (v) => v !== undefined
      ))
    );
  }

  public static from(html: string): Crafty.Unknown;
  public static from(el: Element): Crafty.Unknown;
  public static from<T extends Crafty.Node>(node: T): T;
  public static from(arg: Crafty.Node | string | Element): Crafty.Node | Crafty.Unknown {
    if (arg instanceof Internal_Node) {
      return arg.clone();
    } else {
      return new Internal_Unknown(arg as Element | string);
    }
  }
  static Element: Crafty.ElementStatic = Internal_Element;
  static HTMLElement: Crafty.HTMLElementStatic = Internal_HTMLElement;
  static VoidHTMLElement: Crafty.VoidHTMLElementStatic = Internal_VoidHTMLElement;
  static Text: Crafty.TextStatic = Internal_Text;
  static Fragment: Crafty.FragmentStatic = Internal_Fragment;
  static Unknown: Crafty.UnknownStatic = Internal_Unknown;
  static Comment: Crafty.CommentStatic = Internal_Comment;

  static Exception: Crafty.ExceptionConstructor = Internal_Exception;
  static ChildrenNotAllowedException: Crafty.ChildrenNotAllowedExceptionConstructor = Internal_ChildrenNotAllowedException;
  static NormalizationException: Crafty.NormalizationExceptionConstructor = Internal_NormalizationError;
}