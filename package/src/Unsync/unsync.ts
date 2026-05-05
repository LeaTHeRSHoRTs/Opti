import { OptiModuleError } from "../helpers/helpers";
import * as Class from "./class";
import * as Evented from "./events";

(function() {
  if (!Opti) throw new OptiModuleError("evented");

  globalThis.Opti.unsync = true; 
  globalThis.Unsync = Class.Unsync;
  globalThis.Emitter = Evented.Emitter;
  globalThis.SetEmitter = Evented.SetEmitter;

  HTMLCollection.prototype.addEventListener = Evented.addEventListenerEnum;
  NodeList.prototype.addEventListener = Evented.addEventListenerEnum;
  EventTarget.prototype.addConditionalListener = Evented.addConditionalListener;
  EventTarget.prototype.addEventListeners = Evented.addEventListeners;
  EventTarget.prototype.delegateEventListener = Evented.delegateEventListener;
  EventTarget.prototype.addEventController = Evented.addEventController;
})();