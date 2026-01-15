/** Represents a common character on an english keyboard */
type char =
  | ' ' | '!' | '"' | '#' | '$' | '%' | '&' | "'" | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | ':' | ';' | '<' | '=' | '>' | '?' | '@' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S'
  | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | '[' | ']' | '^' | '_' | '`' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
  | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '{' | '|' | '}' | '~' | '\\';

// type char = string & { length: 1 }

/** Shorthand for `unknown` */
type _ = unknown;

type GlobalThis = typeof globalThis;

/** Shortcut for `Record<string, T>` */
type StringRecord<T> = Record<string, T>;

type Stringed<T> = T extends string ? T : never;

/** Construct a type with a set of properties K of type T, all of which are optional */
type PartialRecord<K extends Key, T> = Partial<Record<K, T>>;

type CaseConventions = "camel" | "kebab" | "pascal" | "snake" | "train" | "dot";

type CSSObject = Partial<Record<keyof CSSStyleDeclaration, string | number>>;

type CSSPropertyName = Exclude<keyof CSSStyleDeclaration, number | symbol>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func<T = any, A extends any[] = any[], R = any> = (this: T, ...args: A) => R;
declare namespace Func {
  /** Gets a function's argument list types */
  export type Arguments<T extends Func> = T extends Func<any, infer P, any> ? P : never;

  /** Get a function's return type */
  export type Return<T extends Func> = ReturnType<T>

  /** Get a function's `this` argument type */
  export type This<T extends Func> = ThisParameterType<T>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Class<Abstract extends boolean = true, A extends any[] = any[], I = any> = Abstract extends true ? abstract new(...args: A) => I : new(...args: A) => I;
declare namespace Class {
  export type Instance<T extends Class> = T extends Class<boolean, any[], infer I> ? I : never;

  export interface Constructable { new(...args: any[]): any }
  export type Constructor<T extends Class = Class> = T extends Class<boolean, infer A, infer I> ? (this: void, ...args: A) => I : never;

  export namespace Instance {
    type InstanceType<I> = Class<boolean, any[], I>;
    export type Methods<T extends Class> = T extends InstanceType<infer I extends Key> ? { [K in I]: K extends Func ? K : never } : never;
  }
}

/** Used as a placeholder type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type placeholder = any;

/** Represents a key in a key-value object */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Key = keyof any;

/** Flattens array types like `T[][]` and others */
type Flatten<T extends readonly unknown[]> =
  T extends readonly (infer U extends readonly unknown[])[]
  ? Flatten<U>
  : T;

/** Unboxes Object types to primitives */
type Unboxed<T> =
  T extends readonly [infer First, ...infer Rest]
    ? [Unboxed<First>, ...Unboxed<Rest>]
    : T extends new (...args: unknown[]) => infer R
      ? Unboxed<R>
      : T extends StringConstructor ? string
      : T extends NumberConstructor ? number
      : T extends BooleanConstructor ? boolean
      : T extends SymbolConstructor ? symbol
      : T;

type GetterKeys<T> = {
  [K in keyof T]-?: T[K] extends Func ? never : (
    { -readonly [P in K]: T[K] } extends { [P in K]: T[K] } ? K : never
  )
}[keyof T];

type SetterKeys<T> = {
  [K in keyof T]-?: T[K] extends Func ? never : (
    { -readonly [P in K]: T[K] } extends { [P in K]: T[P] } ? K : never
  )
}[keyof T];

type WritableKeys<T> = {
  [K in keyof T]-?:
  { -readonly [P in K]: T[K] } extends { [P in K]: T[K] } ? K : never
}[keyof T];

type WritableOnly<T> = Pick<T, WritableKeys<T>>;

type Only<T, U extends keyof T> = { [K in keyof T as Extract<T[K], U> extends never ? never : K]: T[K] }

type AccessorKeys<T> = GetterKeys<T> | SetterKeys<T>;

/** Makes a raw type defined. Does not make object values not undefined */
type Defined<T> = Exclude<T, undefined>;

/** Objects that have a `size` or `length` property */
type Sized = { size: number } | { length: number }

type TupleOf<T, N extends number, R extends unknown[] = []> =
  R['length'] extends N
    ? R
    : R['length'] extends 20 
      ? T[] 
      : TupleOf<T, N, [T, ...R]>

type BuildTuple<L extends number, T extends unknown[] = []> = 
  T['length'] extends L ? T : BuildTuple<L, [unknown, ...T]>;

type Increment<N extends number> = [...BuildTuple<N>, unknown]['length']; 
type Decrement<N extends number> = BuildTuple<N> extends [infer _u, ...infer Rest] ? Rest['length'] : never;

type Widen<T> = 
  T extends string ? string :
  T extends number ? number :
  T extends boolean ? boolean :
  T extends symbol ? symbol :
  T;

type Falsy<T> =
  T extends false ? false :
  T extends "" ? "" :
  T extends 0 ? 0 | -0 :
  T extends 0n ? 0n :
  T extends null ? null :
  T extends undefined ? undefined :
  never;
type Truthy<T> = Exclude<T, Falsy<T>>;

type AllTruthy = Truthy<string | number | boolean | object | symbol | null | undefined>;

type Primitive =
  | "undefined"
  | "object"
  | "boolean"
  | "number"
  | "string"
  | "function"
  | "symbol"
  | "bigint";

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

type EventFunc<T, K extends keyof EventMapOf<T> = keyof EventMapOf<T>> = (this: T, e: EventMapOf<T>[K]) => void

type TypeGuard<T> = T extends Func ? FuncTesters<T>
  : T extends unknown[] ? ArrayTesters<T>
  : T extends Sized ? SizedObjectTesters<T> 
  : BaseTypeOperators<T>

type UUIDConstructor = new () => string & { readonly __brand: unique symbol };

/** Repesents a html tag in string form */
type HTMLTag = keyof HTMLElementTagNameMap;
type SGVTag = keyof SVGElementTagNameMap;
type MathMLTag = keyof MathMLElementTagNameMap;

type PropertiesOf<T> = {
  [K in keyof T]: T[K] extends Func ? never : K;
}[keyof T];

type Broadcaster<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => infer R
    ? (...args: Parameters<T[K]>) => Broadcaster<R>
    : never;
}

/**
 * Gets a `HTMLElement` from a string
 */
type HTMLElementOf<T extends string> =
  T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] :
  HTMLElement;

type SVGElementOf<T extends keyof SVGElementTagNameMap> =
  SVGElementTagNameMap[T];

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

/** Returns the resulting type(s) of the function(s) given */

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
  T extends Window & typeof globalThis ? WindowEventMap :
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
  T extends MessageEventTarget<unknown> ? MessageEventTargetEventMap :
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