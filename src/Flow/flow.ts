import { setNameOfGlobalThisProp } from "src/helpers/helpers";

import * as Flow from "./flowclass";

(function() {
  globalThis.Opti.flow = true;
  globalThis.Flow = Flow.Internal_Flow;
  setNameOfGlobalThisProp("Flow", "Flow");
})();