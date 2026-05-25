import { _InternalChildrenNotAllowedException } from "./exceptions";
import _InternalHTMLElement from './htmlelement';

export default class _InternalVoidHTMLElement<T extends VoidHTMLTag, P extends Crafty.Props<T> = Crafty.Props<T>> extends _InternalHTMLElement<T, P> implements Crafty.VoidHTMLElement<T, P> {

  constructor(tag: T, props?: P) {
    super(tag, props, []);
  }

  append(_: Crafty.Node): never {
    throw new _InternalChildrenNotAllowedException("VoidHTMLElements are auto closing elements and therefore cannot have children");
  }
  prepend(_: Crafty.Node): never {
    throw new _InternalChildrenNotAllowedException("VoidHTMLElements are auto closing elements and therefore cannot have children");
  }

  static [Symbol.hasInstance](inst: unknown): inst is _InternalVoidHTMLElement<VoidHTMLTag> {
    return Function.prototype[Symbol.hasInstance].call(this, inst);
  }
}