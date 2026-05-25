import "@crafty";
import { isHTMLTag, isVoidHTMLTag } from "./helpers";
import _InternalException, { _InternalChildrenNotAllowedException, _InternalNormalizationError } from "./exceptions";
import _InternalNode from "./node";
import _InternalHtml from "./html";
import _InternalText from "./text";
import _InternalFragment from "./fragment";
import _InternalComment from "./comment";
import _InternalElement from "./element";
import _InternalHTMLElement from "./htmlelement";
import _InternalVoidHTMLElement from "./voidhtmlelement";

export class _InternalCrafty {
  private constructor() {}

  public static craft<T extends VoidHTMLTag, U extends Crafty.Props<T> = {}>(el: T, props?: U, children?: Crafty.Node[] ): Crafty.VoidHTMLElement<T, U>;
  public static craft<T extends Crafty.NormalHTMLTag, U extends Crafty.Props<T> = {}>(el: T, props?: U, children?: Crafty.Node[] ): Crafty.HTMLElement<T, U>;
  public static craft<N extends Crafty.Namespace, T extends Crafty.TagFromNamespace<N>, U extends Crafty.Props<T> = {}>(namespace: N, el: T, props?: U, children?: Crafty.Node[] ): Crafty.Element<N, T, U>;
  public static craft(...children: Arr.Present<Crafty.Node> ): Crafty.Fragment;
  public static craft(type: Crafty.COMMENT, comment: string) : Crafty.Comment;
  public static craft(type: Crafty.TEXT, str: string): Crafty.Text;
  public static craft(type: Crafty.HTML, html: string): Crafty.Html;
  public static craft(...args: unknown[]): Crafty.Node {
    const first = args[0];
    const second = args[1];
    const third = args[2];
    const fourth = args.splice(3) as Crafty.Node[];

    switch (first) {
      case Crafty.TEXT : return new _InternalText(second as string);
      case Crafty.HTML : return new _InternalHtml(second as string);
      case Crafty.COMMENT : return new _InternalComment(second as string);
    }

    // : Crafty.HTMLElement
    if (typeof first === 'string') {
      if (isHTMLTag(first)) {
        const children = (Array.isArray(third) ? third : third ? [third] : []) as Crafty.Node[];

        if (isVoidHTMLTag(first)) {
          return new _InternalVoidHTMLElement(
            first,
            second as Crafty.Props<typeof first> | undefined
          );
        } else {
          return new _InternalHTMLElement(
            first,
            second as Crafty.Props<typeof first> | undefined,
            children
          );
        }
      }
      if (typeof second === 'string') {
        const namespace = first as Crafty.Namespace;
        const props = third as Crafty.Props<typeof second>;
        return new _InternalElement(namespace, second, props, fourth);
      }
    }

    const rawNodes = [first, second, third, ...fourth];
    const cleanNodes = rawNodes.filter(
      (v): v is Crafty.Node => v !== undefined && v !== null && typeof v !== 'string' && !v.toString().includes('Object')
    );

    return new _InternalFragment(...cleanNodes);
  }

  public static from(html: string): Crafty.Fragment;
  public static from(el: Element): Crafty.Node;
  public static from<T extends Crafty.Node>(node: T): T;
  public static from(arg: Crafty.Node | string | Element): Crafty.Node | Crafty.Fragment {
    if (arg instanceof _InternalNode) {
      return arg.clone();
    } else if (arg instanceof Element) {
      const frag = new _InternalFragment();
      frag.html();
      return frag;
    } else {
      return _InternalCrafty.craft(Crafty.TEXT, arg as string);
    }
  }

  static isElement(node: unknown): node is Crafty.Element { return node instanceof _InternalElement; }
  static isHTMLElement(node: unknown): node is Crafty.HTMLElement { return node instanceof _InternalHTMLElement; }
  static isVoidHTMLElement(node: unknown): node is Crafty.VoidHTMLElement { return node instanceof _InternalVoidHTMLElement; }
  static isText(node: unknown): node is Crafty.Text { return node instanceof _InternalText; }
  static isFragment(node: unknown): node is Crafty.Fragment { return node instanceof _InternalFragment; }
  static isComment(node: unknown): node is Crafty.Comment { return node instanceof _InternalComment; }

  static Exception: Crafty.ExceptionConstructor = _InternalException;
  static ChildrenNotAllowedException: Crafty.ChildrenNotAllowedExceptionConstructor = _InternalChildrenNotAllowedException;
  static NormalizationException: Crafty.NormalizationExceptionConstructor = _InternalNormalizationError;
}