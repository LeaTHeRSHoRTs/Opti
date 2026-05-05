export class Internal_Exception extends Exception { _name = "QueryException"; }
export class Internal_MalformedQueryException extends Internal_Exception { _name = "MalformedQueryExceptionException"; }

export class Internal_UnsupportedSelectorException extends Internal_Exception { _name = "UnsupportedSelectorExceptionException"; }