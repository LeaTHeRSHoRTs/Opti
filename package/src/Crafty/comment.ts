import _InternalNode from "./node";
import _InternalText from "./text";

export default class _InternalComment extends _InternalNode implements Crafty.Comment, Crafty.Parent<Crafty.Text> {
  override _children: Crafty.Text[] = [];
  constructor(text: string) {
    super(new _InternalText(text));
  }

  public kind: "comment" = "comment";
  normalize(): Comment {
    return new window.Comment(this._children.join(" "));
  }

  static [Symbol.hasInstance](inst: unknown): inst is _InternalComment {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
}