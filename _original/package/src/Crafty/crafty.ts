import { createModuleError } from "../helpers";
import * as Impl from "./class";

(function() {
  if (!Opti) throw createModuleError("crafty");

  globalThis.Crafty = Impl._InternalCrafty;
  globalThis.Opti.crafty = true;
})();