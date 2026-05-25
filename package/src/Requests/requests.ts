import "@request";
import { createModuleError } from "../helpers";
import * as Impl from "./requestfunc";

(function() {
  if (!Opti) throw createModuleError("requests");

  globalThis.request = Impl.request;
})();