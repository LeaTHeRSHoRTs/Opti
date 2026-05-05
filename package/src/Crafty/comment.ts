import Internal_Node from "./node";

export class Internal_Comment extends Internal_Node implements Crafty.Comment, Crafty.Parent<Crafty.Text> {
  override children: Crafty.Text[] = [];
  constructor(text: Crafty.Text[]) {
    super(...text);
  }

  public kind: "comment" = "comment";
  normalize(onMount: (node: Comment) => void): Comment {
    throw new Error("Method not implemented.");
  }

  static [Symbol.hasInstance](inst: unknown): inst is Internal_Comment {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
}