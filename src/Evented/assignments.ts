(function() {
  globalThis.Evented = Opti.Evented;
  globalThis.Thread = Opti.Evented.Thread;
  globalThis.StaticThread = Opti.Evented.StaticThread;

  EventTarget.prototype.addBoundListener = Opti.Evented.addEventRuled;
  EventTarget.prototype.addEventListeners = Opti.Evented.addEventListeners;
  EventTarget.prototype.delegateEventListener = Opti.Evented.delegateEventListener;
  EventTarget.prototype.addEventController = Opti.Evented.addEventController;
})();