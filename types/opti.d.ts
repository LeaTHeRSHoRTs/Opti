/** Represents a common character on an english keyboard */
type char =
  | ' ' | '!' | '"' | '#' | '$' | '%' | '&' | "'" | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | ':' | ';' | '<' | '=' | '>' | '?' | '@' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S'
  | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | '[' | ']' | '^' | '_' | '`' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
  | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '{' | '|' | '}' | '~' | '\\';

// type char = string & { length: 1 }

/** Shortcut for `Record<string, T>` */
type StringRecord<T> = Record<string, T>;

type CaseConventions = "camel" | "kebab" | "pascal" | "snake" | "train" | "dot";

type CSSObject = Partial<Record<keyof CSSStyleDeclaration, string | number>>;

type CSSPropertyName = Exclude<keyof CSSStyleDeclaration, number | symbol>;

type Func = (this: any, ...args: any[]) => any;
namespace Func {
  /** Gets a function's argument list types */
  export type Arguments<T extends Func> = Parameters<T>;

  /** Get a function's return type */
  export type Return<T extends Func> = ReturnType<T>

  /** Get a function's `this` argument type */
  export type This<T extends Func> = ThisParameterType<T>
}

/** Used as a placeholder type */
type placeholder = any;

/** Reperesents a key in a key-value object */
type Key = keyof any;

type Defined<T extends object, U extends keyof T | undefined = undefined> = U extends undefined
  ? { [P in keyof T]-?: T[P] }
  : { [K in U]-?: T[K] } & Omit<T, U>;

/** Flattens array types like `T[][]` and others */
type Flatten<T extends readonly unknown[]> =
  T extends readonly (infer U)[]
  ? Flatten<U>
  : T;

/** Unboxes Object types to primatives */
type Unboxed<T> =
  // Handle arrays recursively
  T extends (infer U)[] ? Unboxed<U>[] :
  // Handle constructors (e.g., String)
  T extends new (...args: any[]) => infer R ? Unboxed<R> :
  // Handle boxed primitives
  T extends String ? string :
  T extends Number ? number :
  T extends Boolean ? boolean :
  T extends Symbol ? symbol :
  // Otherwise leave it as-is
  T;

type GetterKeys<T> = {
  [K in keyof T]-?: T[K] extends Function ? never : (
    { -readonly [P in K]: T[K] } extends { [P in K]: T[K] } ? K : never
  )
}[keyof T];

type SetterKeys<T> = {
  [K in keyof T]-?: T[K] extends Function ? never : (
    { -readonly [P in K]: T[K] } extends { [P in K]: T[P] } ? K : never
  )
}[keyof T];

type WritableKeys<T> = {
  [K in keyof T]-?:
  { -readonly [P in K]: T[K] } extends { [P in K]: T[K] } ? K : never
}[keyof T];

type WritableOnly<T> = Pick<T, WritableKeys<T>>;

type Only<T, U> = { [K in keyof T as Extract<T[K], U> extends never ? never : K]: T[K] }

type AccessorKeys<T> = GetterKeys<T> | SetterKeys<T>;

/** Matches classes */
type Class<T = any> = abstract new (...args: any[]) => T;

/** Makes a raw type defined. Does not make object values not undefined */
type Defined<T> = Exclude<T, undefined>;

/** Objects that have a `size` or `length` property */
type Sized = { size: number } | { length: number }

type TupleOf<T, N extends number, R extends unknown[] = []> =
  R['length'] extends N
    ? R
    : TupleOf<T, N, [T, ...R]>;

type BuildTuple<L extends number, T extends unknown[] = []> = 
  T['length'] extends L ? T : BuildTuple<L, [unknown, ...T]>;

type Increment<N extends number> = [...BuildTuple<N>, unknown]['length']; 
type Decrement<N extends number> = BuildTuple<N> extends [infer _, ...infer Rest] ? Rest['length'] : never;

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
  T extends "function" ? (...args: any[]) => any :
  T extends "object" ? object | null :
  never;

interface BaseTypeOperators<T> {
  get value(): T;
  is(other: unknown): boolean;
  /**
   * Checks if a value is in the format Object, Object(size), Date:time or Function:<name>(...params,)
   * @param str The type string to check
   */
  isTypeString(str: string): boolean;
  stringOf(): string;
  isInstanceOf<U extends Class>(clazz: U): this is BaseTypeOperators<InstanceType<U>>;
  isTypeOf<T extends Primitive>(type: T): this is TypeGuard<TypeOf<T>>;
  isDefined(): this is BaseTypeOperators<NonNullable<T>>;
  isFalsy(): this is BaseTypeOperators<Falsy<T>>;
  isTruthy(): this is BaseTypeOperators<Truthy<T>>;
  isNull(): this is BaseTypeOperators<null>;
  isUndefined(): this is BaseTypeOperators<undefined>;
  alwaysDefined<U>(orElse: U): asserts this is BaseTypeOperators<Exclude<T | U, undefined>>;
  alwaysTruthy<U>(truthy: Truthy<U>): asserts this is BaseTypeOperators<Truthy<T | U>>;
}

interface SizedObjectTesters<T> extends BaseTypeOperators<T> {
  isLength<U extends number>(length: U): this is TypeGuard<T & { length: U }>;
  isLonger(object: Sized): boolean;
  isLonger(length: number): boolean;
  isShorter(length: number): boolean;
  isShorter(object: Sized): boolean;
}

interface ArrayTesters<T extends unknown[]> extends SizedObjectTesters<T> {
  isLength<U extends number>(length: U): this is TypeGuard<TupleOf<T[number], U>>;
  alwaysContainsValues<U extends T[number]>(values: [U, ...U[]]): asserts this is TypeGuard<[U, ...U[]]> | TypeGuard<T>;
  containsValues<U extends T[number]>(): this is TypeGuard<[U, ...U[]]>
}

interface FuncTesters<T extends Func> extends BaseTypeOperators<T> {
  isName(name: string): boolean;
}

type TypeGuard<T> = T extends Func ? FuncTesters<T>
  : T extends Array<infer U> ? ArrayTesters<T>
  : T extends Sized ? SizedObjectTesters<T> 
  : BaseTypeOperators<T>

type UUIDConstructor = new () => readonly string & { readonly __brand: unique symbol };

/** Repesents a html tag in string form */
type HTMLTag = keyof HTMLElementTagNameMap;

type PropertiesOf<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type Broadcaster<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R
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
type CallbackResult<T extends ((...args: any[]) => any) | readonly ((...args: any[]) => any)[]> =
  T extends ((...args: any[]) => any) ? ReturnType<T> :
  T extends readonly [...infer R] ? R extends ((...args: any[]) => any)[] ? { [K in keyof R]: ReturnType<R[K]> } : never : never;
type EventList<T> =
  T extends { events?: any }
  ? Record<string, Func[]> // stop if "events" already exists
  : Partial<Record<keyof EventMapOf<T>, Func[]>>;

type SortMode<T> =
  T extends string ? "alpha" | "alpha-reverse" :
  T extends number ? "increasing" | "decreasing" :
  T extends Date ? "earlier" | "later" :
  "random";

/** Gest the event map for the specified object */
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
  T extends MessageEventTarget<any> ? MessageEventTargetEventMap :
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


/**
 * @opti
 */
type HTMLAttrs = {
  text?: string,
  html?: string,
  id?: string;
  class?: string | string[];
  style?: { [key: string]: string };
  [key: string]: any
};

/**
 * @opti
 */
type ElementNode = {
  tag: HTMLTag;
  class?: string;
  text?: string;
  html?: string;
  style?: Record<string, string | number>;
  children?: ElementNode | ElementNode[];
  [key: string]:
  | string
  | number
  | Record<string, string | number>
  | ElementNode
  | ElementNode[]
  | undefined;
}

interface ValueAccessor {
  asString(): string;
  asNumber(): number | null;
  asBoolean(): boolean | null
  asDate(): Date | null
}

interface OptiObject {
  crafty: false,
  query: false,
  evented: false,
  requests: false,
  flow: false
};