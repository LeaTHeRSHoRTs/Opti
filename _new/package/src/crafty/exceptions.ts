export default class _InternalException extends Error { _name = "CraftyException"; }
export class _InternalChildrenNotAllowedException extends _InternalException { _name = "CraftyException"; }
export class _InternalNormalizationError extends _InternalException { _name = "NormalizationError"; }