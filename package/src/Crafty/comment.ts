import _InternalNode from "./node";

export default class Internal_Comment extends _InternalNode implements Crafty.Comment, Crafty.Parent<Crafty.Text> {
  override children: Crafty.Text[] = [];
  constructor(text: Crafty.Text[]) {
    super(...text);
  }

  public kind: "comment" = "comment";
  normalize(): Comment {
    return new window.Comment(this.children.join(" "));
  }

  static [Symbol.hasInstance](inst: unknown): inst is Internal_Comment {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
}