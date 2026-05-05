import { OptiModuleError } from "../helpers/helpers";
import * as Impl from "./class";

(function() {
  if (!Opti) throw new OptiModuleError("crafty");

  globalThis.Crafty = Impl.Internal_Crafty;
  globalThis.Opti.crafty = true;
})();