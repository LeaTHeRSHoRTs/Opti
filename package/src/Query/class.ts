/// <reference path="../../../types/modules/Query/query.lib.d.ts" />

import { setPropName } from "../helpers/helpers";
import { Internal_MalformedQueryException, Internal_UnsupportedSelectorException } from "./exceptions";

export @Final class Internal_Query {
  static MalformedQueryException: Query.MalformedQueryExceptionConstructor = Internal_MalformedQueryException;
  static UnsupportedSelectorException: Query.UnsupportedSelectorExceptionConstructor = Internal_UnsupportedSelectorException;

  static {
    setPropName(this, "MalformedQueryException");
    setPropName(this, "UnsupportedSelectorException");
  }
}