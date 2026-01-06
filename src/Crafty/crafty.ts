import * as Impl from "./class";
import * as Exceptions from "./exceptions";

(function() {
  globalThis.Crafty = Impl.Internal_Crafty;
  Object.defineProperty(globalThis.Crafty, "name", { value: "Crafty" });
})();