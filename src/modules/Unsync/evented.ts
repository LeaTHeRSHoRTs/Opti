import * as Evented from "./events";

(function() {
  globalThis.Opti.unsync = true; 
  globalThis.Emitter = Evented.Emitter;
  globalThis.SetEmitter = Evented.SetEmitter;

  const emitter = new SetEmitter({
    call: [String],
    back: [String, Number, Boolean],
  });

  emitter.on("call", 
    
  );

  HTMLCollection.prototype.addEventListener = Evented.addEventListenerEnum;
  NodeList.prototype.addEventListener = Evented.addEventListenerEnum;
  EventTarget.prototype.addConditionalListener = Evented.addConditionalListener;
  EventTarget.prototype.addEventListeners = Evented.addEventListeners;
  EventTarget.prototype.delegateEventListener = Evented.delegateEventListener;
  EventTarget.prototype.addEventController = Evented.addEventController;
})();