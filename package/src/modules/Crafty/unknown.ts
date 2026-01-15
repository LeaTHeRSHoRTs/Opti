import { Internal_NormalizationError } from "./exceptions";
import Internal_Node from "./node";

export default class Internal_Unknown extends Internal_Node implements Crafty.Unknown {
  readonly contents: string | Element | undefined;

  constructor(data?: string | Element) {
    super();
    this.contents = data;
  }
  public kind: "unknown" = "unknown";

  normalize(_: (node: Node) => void): never {
    throw new Internal_NormalizationError("An unknown node cannot be normalized due to unknown properties.");
  }

  static [Symbol.hasInstance](inst: unknown): inst is Internal_Unknown {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
}