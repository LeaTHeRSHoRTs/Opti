import './unsync.js';
import './interfaces.js';
import './exceptions.js';

declare global {

    var Emitter: Unsync.EmitterConstructor;
    var SetEmitter: Unsync.SetEmitterConstructor;
    var Unsync: UnsyncStatic;

    interface UnsyncStatic {
        InvalidRegistrationException: InvalidRegistrationErrorConstructor;
    }

    interface EventTarget {
        /** 
         * Creates an event listener that triggers a set amount of times
         * @opti
         * @param type The type of listener to use
         * @param listener The callback of the listener
         * @param timesOrCondition The amount of times to run, or the condition that when true causes the listener to be removed
         * @param options Optional options to give the listener 
         * @example
         * const el = document.$("#target");
         * 
         * el.addConditionalListener("click", () => {
         *   el.removeAttr("id");
         * }, 1);
         * 
         * let mouseover = false;
         * 
         * el.addConditionalListener("mouseover", () => {
         *   el.removeAttr("id");
         *   mouseover = true;
         * }, () => mouseover);
         */
        addConditionalListener<T extends EventTarget, K extends keyof EventMapOf<T>>(
            this: T,
            type: K,
            listener: (this: T, e: EventMapOf<T>[K]) => void,
            timesOrCondition: number | ((this: T, e: EventMapOf<T>[K]) => boolean),
            options?: boolean | AddEventListenerOptions
        ): void;

        /** 
         * Adds multiple event listeners to the target
         * @opti
         * @param listeners The listeners to apply
         * @example
         * document.addEventListeners({
         *   load: () => console.log("loaded!"),
         *   unload: () => console.log("unloaded!")
         * });
         */
        addEventListeners<T extends EventTarget>(
            this: T,
            listeners: {
                [K in keyof EventMapOf<T>]?: (this: T, e: EventMapOf<T>[K]) => void
            }
        ): void;

        /** 
         * Adds multiple event listeners that resolve under a unified callback
         * @opti
         * @param types The events to listen to
         * @param listener The listener to apply
         * @param options options for the event listeners
         * @example
         * document.addEventListeners(["load", "unload"], () => {
         *   console.log("document experienced a loading event");
         * });
         */
        addEventListeners<T extends EventTarget>(
            this: T,
            types: (keyof EventMapOf<T>)[],
            listener: (this: T, e: Event) => void,
            options?: boolean | AddEventListenerOptions
        ): void;

        /** 
         * Delegates an event listener to a child of the node
         * @opti
         * @param type The events to listen to
         * @param delegates The child element that the event should fire on
         * @param listener The listener to apply
         * @param options options for the event listeners
         * @example
         * document.delegateEventListener("click", "button", () => {
         *   console.log("Button has had a click event happen"); // Even works after DOM mutation
         * });
         */
        delegateEventListener<T extends EventTarget, U extends Element, K extends keyof EventMapOf<T>>(
            this: T,
            type: K,
            delegates: HTMLTag | string,
            listener: (this: U, e: EventMapOf<T>[K]) => void,
            options?: boolean | AddEventListenerOptions
        ): void;

        /**
         * Adds an event listener to the event target and returns a controller that provides control of the event listener
         * @opti
         * @param type The event to listen form
         * @param listener The listener to apply
         * @param options The options for the event listener
         */
        addEventController<T extends EventTarget, K extends keyof EventMapOf<T>>(
            this: T,
            type: K,
            listener: (e: EventMapOf<T>[K]) => void,
            options?: boolean | AddEventListenerOptions
        ): Unsync.EventController;
    }

    interface NodeList {
        /** 
         * Adds the same event listener to every element in the list
         * @opti
         * @param type The type of listener to attach
         * @param listener The callback to the event
         * @param options Options of the event listener
         * @example
         * document.$$("div.panel")
         *   .addEventListeners("click", () => {
         *     this.fadeOut(3000);
         *     this.removeClass("panel");
         *   });
         */
        addEventListener<T extends EventTarget>(
            this: Iterable<T>,
            type: keyof EventMapOf<T>,
            listener: (this: T, e: EventMapOf<T>[keyof EventMapOf<T>]) => void,
            options?: boolean | AddEventListenerOptions
        ): void;
    }

    interface HTMLCollection {
        /** 
         * Adds the same event listener to every element in the list
         * @opti
         * @param type The type of listener to attach
         * @param listener The callback to the event
         * @param options Options of the event listener
         * @example
         * document.$$("div.panel")
         *   .addEventListeners("click", () => {
         *     this.fadeOut(3000);
         *     this.removeClass("panel");
         *   });
         */
        addEventListener<T extends EventTarget, K extends keyof EventMapOf<T>>(
            this: Iterable<T>,
            type: K,
            listener: (this: T, e: EventMapOf<T>[keyof EventMapOf<T>]) => void,
            options?: boolean | AddEventListenerOptions
        ): void;
    }
}

export const Unsync: placeholder;