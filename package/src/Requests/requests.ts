import { OptiModuleError } from "../helpers/helpers";
import * as Impl from "./requestfunc";

(function() {
  if (!Opti) throw new OptiModuleError("requests");

  globalThis.request = Impl.request;
})();