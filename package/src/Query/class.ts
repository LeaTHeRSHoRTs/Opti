import { setPropName } from "../helpers";
import { Internal_MalformedQueryException, Internal_UnsupportedSelectorException } from "./exceptions";

export class Internal_Query {
  static MalformedQueryException: Query.MalformedQueryExceptionConstructor = Internal_MalformedQueryException;
  static UnsupportedSelectorException: Query.UnsupportedSelectorExceptionConstructor = Internal_UnsupportedSelectorException;

  static {
    setPropName(this, "MalformedQueryException");
    setPropName(this, "UnsupportedSelectorException");
  }
}