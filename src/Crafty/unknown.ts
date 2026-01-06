import { Internal_NormalizationError } from "./exceptions";
import Internal_Node from "./node";

export default class CUnknown extends Internal_Node implements Crafty.Unknown {
  readonly contents: string | Element | undefined;

  constructor(data?: string | Element) {
    super();
    this.contents = data;
  }
  public kind: "unknown" = "unknown";

  normalize(_: (node: Node) => void): never {
    throw new Internal_NormalizationError("An unknown node cannot be normalized due to unknown properties.");
  }
}