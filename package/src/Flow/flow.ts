/// <reference path="../../../types/modules/Flow/flow.lib.d.ts" />

import { OptiModuleError, setNameOfGlobalThisProp } from "../helpers/helpers";

import * as Flow from "./flowclass";

(function() {
  if (!Opti) throw new OptiModuleError("flow");

  globalThis.Opti.flow = true;
  globalThis.Flow = Flow.Internal_Flow;
  setNameOfGlobalThisProp("Flow");
})();