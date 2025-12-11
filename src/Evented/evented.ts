import * as Evented from "./events";

(function() {
  globalThis.Evented = Evented.Evented;
  globalThis.Thread = Evented.Thread;

  HTMLCollection.prototype.addEventListener = Evented.addEventListenerEnum;
  NodeList.prototype.addEventListener = Evented.addEventListenerEnum;
  EventTarget.prototype.addConditionalListener = Evented.addConditionalListener;
  EventTarget.prototype.addEventListeners = Evented.addEventListeners;
  EventTarget.prototype.delegateEventListener = Evented.delegateEventListener;
  EventTarget.prototype.addEventController = Evented.addEventController;
})();