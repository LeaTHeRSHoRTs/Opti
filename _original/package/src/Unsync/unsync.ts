import { createModuleError } from "../helpers";
import * as Class from "./class";
import * as Events from "./events";
import * as Listeners from "./listeners";

(function() {
  if (!Opti) throw createModuleError("evented");

  globalThis.Opti.unsync = true; 
  globalThis.Unsync = Class.Unsync;
  globalThis.Emitter = Events.Emitter;
  globalThis.SetEmitter = Events.SetEmitter;

  HTMLCollection.prototype.addEventListener = Listeners.addEventListenerEnum;
  NodeList.prototype.addEventListener = Listeners.addEventListenerEnum;
  EventTarget.prototype.addConditionalListener = Listeners.addConditionalListener;
  EventTarget.prototype.addEventListeners = Listeners.addEventListeners;
  EventTarget.prototype.delegateEventListener = Listeners.delegateEventListener;
  EventTarget.prototype.addEventController = Listeners.addEventController;
})();