/** Shorthand for `unknown` */
type _ = unknown;

/** Used as a placeholder type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type placeholder = any;

/** Represents a key in a key-value object */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Key = keyof any;

/** Type representation of the `globalThis` variable */
type GlobalThis = typeof globalThis;

/** Shortcut for `Record<string, T>` */
type StringRecord<T> = Record<string, T>;

/** Extract from `T` those types that are assignable to `string` */
type Stringed<T> = Extract<T, string>;

/** Construct a type with a set of properties K of type T, all of which are optional */
type PartialRecord<K extends Key, T> = Partial<Record<K, T>>;

type WritableOnly<T> = Pick<T, Object.Writable<T>>;

/** Filters an object `U` by type `T` */
type Only<T, U> = { [K in keyof T as T[K] extends U ? K : never]: T[K] };

/** Makes a raw type defined. Does not make object values not undefined */
type Defined<T> = Exclude<T, undefined>;

/** Objects that have a `size` or `length` property */
type Sized = { size: number } | { length: number };

type Broadcaster<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => infer R
    ? (...args: Parameters<T[K]>) => Broadcaster<R>
    : never;
};

/** Unboxes Object types to primitives */
type Unboxed<T> =
  T extends readonly [infer First, ...infer Rest]
    ? [Unboxed<First>, ...Unboxed<Rest>]
    : T extends new (...args: unknown[]) => infer R
      ? Unboxed<R>
      : T extends StringConstructor | typeof String ? string
      : T extends NumberConstructor | typeof Number ? number
      : T extends BooleanConstructor | typeof Boolean ? boolean
      : T extends SymbolConstructor | typeof Symbol ? symbol
      : T;

/** 
 * Used for widening type literals to their respective parent types 
 * @example
 * type WidenedString = Widen<'myStringLiteral'> // WidenedString is of type string, not of type 'myStringLiteral'
 */
type Widen<T> = 
  T extends string ? string :
  T extends number ? number :
  T extends boolean ? boolean :
  T extends symbol ? symbol :
  T;

/** A union of the primitive js types, in string form */
type Primitive =
  | "undefined"
  | "object"
  | "boolean"
  | "number"
  | "string"
  | "function"
  | "symbol"
  | "bigint";

/** Parses a string to one of the primitive js types, or never if the string does not correspond to a primitive type */
type TypeOf<T extends string> =
  T extends "string" ? string :
  T extends "number" ? number :
  T extends "bigint" ? bigint :
  T extends "boolean" ? boolean :
  T extends "symbol" ? symbol :
  T extends "undefined" ? undefined :
  T extends "function" ? Func :
  T extends "object" ? object | null :
  never;

type ValueQueries<T> = T extends Func ? FuncTesters<T>
  : T extends Sized ? SizedObjectTesters<T> 
  : BaseValueQueries<T>;


/** Represents a HTML tag in string form */
type HTMLTag = keyof HTMLElementTagNameMap;

/** Represents a HTML tag that cannot contain children in string format */
type VoidHTMLTag = "area" | "base" | "br" | "col" | "embed" | "hr" | "img" | "input" | "link" | "meta" | "param" | "source" | "track" | "wbr";

/** Represents a SVG tag in string form */
type SVGTag = keyof SVGElementTagNameMap;

/** Represents a MathML tag in string form */
type MathMLTag = keyof MathMLElementTagNameMap;

/** Gets the type of a `HTMLElement` from a string */
type HTMLElementOf<T extends string> =
  T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] :
  HTMLElement;

/** Gets the type of a `SVGElement` from a string */
type SVGElementOf<T extends keyof SVGElementTagNameMap> =
  SVGElementTagNameMap[T];

  /** Gets the type of a `MathMLElement` from a string */
type MathMLElementOf<T extends keyof MathMLElementTagNameMap> =
  MathMLElementTagNameMap[T];

/** Extract tag name from element type for HTMLElement */
type HTMLElementTagNameOf<T extends HTMLElement> = {
  [K in keyof HTMLElementTagNameMap | keyof HTMLElementDeprecatedTagNameMap]:
  K extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[K] extends T ? K : never
  : K extends keyof HTMLElementDeprecatedTagNameMap
  ? HTMLElementDeprecatedTagNameMap[K] extends T ? K : never
  : never
}[keyof HTMLElementTagNameMap | keyof HTMLElementDeprecatedTagNameMap];

/** Extract tag name from element type for SGVElement */
type SVGElementTagNameOf<T extends SVGElement> = {
  [K in keyof SVGElementTagNameMap]: SVGElementTagNameMap[K] extends T ? K : never;
}[keyof SVGElementTagNameMap];

/** Extract tag name from element type for MathMLElement */
type MathMLElementTagNameOf<T extends MathMLElement> = {
  [K in keyof MathMLElementTagNameMap]: MathMLElementTagNameMap[K] extends T ? K : never;
}[keyof MathMLElementTagNameMap];

type SortMode<T> =
  T extends string ? "alpha" | "alpha-reverse" :
  T extends number ? "increasing" | "decreasing" :
  T extends Date ? "earlier" | "later" :
  never;

/** Gets the event map for the specified object */
type EventMapOf<T> =
  T extends HTMLVideoElement ? HTMLVideoElementEventMap :
  T extends HTMLMediaElement ? HTMLMediaElementEventMap :
  T extends HTMLBodyElement ? HTMLBodyElementEventMap :
  T extends HTMLFrameSetElement ? HTMLFrameSetElementEventMap :
  T extends HTMLElement ? HTMLElementEventMap :
  T extends SVGSVGElement ? SVGSVGElementEventMap :
  T extends SVGElement ? SVGElementEventMap :
  T extends ShadowRoot ? ShadowRootEventMap :
  T extends Document ? DocumentEventMap :
  T extends Window & GlobalThis ? WindowEventMap :
  T extends Worker ? WorkerEventMap :
  T extends ServiceWorker ? ServiceWorkerEventMap :
  T extends ServiceWorkerRegistration ? ServiceWorkerRegistrationEventMap :
  T extends ServiceWorkerContainer ? ServiceWorkerContainerEventMap :
  T extends RTCPeerConnection ? RTCPeerConnectionEventMap :
  T extends RTCDataChannel ? RTCDataChannelEventMap :
  T extends RTCDTMFSender ? RTCDTMFSenderEventMap :
  T extends RTCDtlsTransport ? RTCDtlsTransportEventMap :
  T extends RTCIceTransport ? RTCIceTransportEventMap :
  T extends RTCSctpTransport ? RTCSctpTransportEventMap :
  T extends AudioScheduledSourceNode ? AudioScheduledSourceNodeEventMap :
  T extends AudioWorkletNode ? AudioWorkletNodeEventMap :
  T extends ScriptProcessorNode ? ScriptProcessorNodeEventMap :
  T extends BaseAudioContext ? BaseAudioContextEventMap :
  T extends OfflineAudioContext ? OfflineAudioContextEventMap :
  T extends AudioDecoder ? AudioDecoderEventMap :
  T extends AudioEncoder ? AudioEncoderEventMap :
  T extends VideoDecoder ? VideoDecoderEventMap :
  T extends VideoEncoder ? VideoEncoderEventMap :
  T extends FontFaceSet ? FontFaceSetEventMap :
  T extends PaymentRequest ? PaymentRequestEventMap :
  T extends PaymentResponse ? PaymentResponseEventMap :
  T extends MediaDevices ? MediaDevicesEventMap :
  T extends MediaStream ? MediaStreamEventMap :
  T extends MediaStreamTrack ? MediaStreamTrackEventMap :
  T extends MediaRecorder ? MediaRecorderEventMap :
  T extends MediaSource ? MediaSourceEventMap :
  T extends MessagePort ? MessagePortEventMap :
  T extends MessageEventTarget<_> ? MessageEventTargetEventMap :
  T extends BroadcastChannel ? BroadcastChannelEventMap :
  T extends WebSocket ? WebSocketEventMap :
  T extends NavigationHistoryEntry ? NavigationHistoryEntryEventMap :
  T extends Notification ? NotificationEventMap :
  T extends Performance ? PerformanceEventMap :
  T extends VisualViewport ? VisualViewportEventMap :
  T extends ScreenOrientation ? ScreenOrientationEventMap :
  T extends RemotePlayback ? RemotePlaybackEventMap :
  T extends WakeLockSentinel ? WakeLockSentinelEventMap :
  T extends TextTrackCue ? TextTrackCueEventMap :
  T extends TextTrack ? TextTrackEventMap :
  T extends TextTrackList ? TextTrackListEventMap :
  T extends SpeechSynthesisUtterance ? SpeechSynthesisUtteranceEventMap :
  T extends SpeechSynthesis ? SpeechSynthesisEventMap :
  T extends MathMLElement ? MathMLElementEventMap :
  T extends IDBOpenDBRequest ? IDBOpenDBRequestEventMap :
  T extends IDBDatabase ? IDBDatabaseEventMap :
  T extends IDBTransaction ? IDBTransactionEventMap :
  T extends IDBRequest ? IDBRequestEventMap :
  T extends XMLHttpRequest ? XMLHttpRequestEventMap :
  T extends XMLHttpRequestEventTarget ? XMLHttpRequestEventTargetEventMap :
  T extends FileReader ? FileReaderEventMap :
  T extends MediaQueryList ? MediaQueryListEventMap :
  T extends EventSource ? EventSourceEventMap :
  T extends PermissionStatus ? PermissionStatusEventMap :
  T extends Animation ? AnimationEventMap :
  T extends MIDIAccess ? MIDIAccessEventMap :
  T extends MIDIInput ? MIDIInputEventMap :
  T extends MIDIPort ? MIDIPortEventMap :
  T extends SourceBufferList ? SourceBufferListEventMap :
  T extends SourceBuffer ? SourceBufferEventMap :
  T extends AbortSignal ? AbortSignalEventMap :
  T extends OffscreenCanvas ? OffscreenCanvasEventMap :
  T extends Element ? ElementEventMap :
  T extends GlobalEventHandlers ? GlobalEventHandlersEventMap :
  T extends WindowEventHandlers ? WindowEventHandlersEventMap :
  T extends AbstractWorker ? AbstractWorkerEventMap :
  never; // fallback