import { isHTMLTag, isVoidHTMLTag } from "./helpers";
import _InternalException, { _InternalChildrenNotAllowedException, _InternalNormalizationError } from "./exceptions";
import _InternalNode from "./node";
import _InternalText from "./text";
import _InternalFragment from "./fragment";
import _InternalComment from "./comment";
import { _InternalElement, _InternalHTMLElement, _InternalVoidHTMLElement } from "./element";

export class _InternalCrafty {
  private constructor() {}
  public static craft(
    first: string | Crafty.Node,
    second?: string | Crafty.Props<string> | Crafty.Node,
    third?: Crafty.Props<string> | Crafty.Node | Crafty.Node[],
    ...fourth: Crafty.Node[]
  ): Crafty.Node {
    if (typeof first === 'string' && second === undefined) {
      return new _InternalText(first);
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
      (v): v is Crafty.Node => v !== undefined && typeof v !== 'string' && !v.toString().includes('Object')
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
      return (_InternalCrafty.craft as typeof Crafty.craft)();
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