import { createModuleError, setNameOfGlobalThisProp } from "../helpers";

import * as Flow from "./flowclass";

(function() {
  if (!Opti) throw createModuleError("flow");

  globalThis.Opti.flow = true;
  globalThis.Flow = Flow._InternalFlow;
  setNameOfGlobalThisProp("Flow");
})();