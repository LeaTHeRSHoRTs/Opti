export default class Internal_Exception extends Exception { _name = "CraftyException"; }
export class Internal_ChildrenNotAllowedException extends Internal_Exception { _name = "CraftyException"; }
export class Internal_NormalizationError extends Internal_Exception { _name = "NormalizationError"; }