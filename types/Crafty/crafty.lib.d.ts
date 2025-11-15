/* eslint-disable no-useless-constructor */
/* eslint-disable no-var */

namespace Crafty {
  export type Child =  Crafty.Element | Crafty.Fragment;
  export type Props<T extends HTMLTag> = {
      classes?: string[],
      text?: string,
      id?: string,
      name?: string,
      css?: Partial<WritableOnly<Only<CSSStyleDeclaration, string | number>>>
    } & Partial<Pick<HTMLElementOf<T>, AccessorKeys<HTMLElementOf<T>>>>

  export type ChildIds<T extends Crafty.Child[]> =
    T extends readonly (infer U)[]
      ? U extends { id?: infer ID } & Crafty.Node<infer C>
        ? ID | ChildIds<U["children"]>
        : never
      : never;

  type Example = ChildIds<[Element<"a", { id: "new" }, [Element<"a", { id: "example" }, []>]>]>

  export type Classes<T extends Crafty.Child[]> =
    Flatten<T> extends readonly (infer U)[]
      ? U extends { classList: infer V }
        ? V extends string
          ? V
          : V extends readonly string[]
            ? V[number]
            : never
        : never
      : never;

  type ChildByID<T extends Crafty.Child[], I> =
    readonly T extends readonly (infer U)[]
      ? U["id"] extends infer V
        ? V extends I
          ? U
          : never
        : never
      : never;

  type ChildByClass<T extends Crafty.Child[], C extends string> =
    Flatten<T> extends readonly (infer U)[]
      ? U extends { classList: infer CL }
        ? CL extends string
          ? C extends CL
            ? U
              : never
                : CL extends readonly string[]
                ? C extends CL[number]
              ? U
            : never
          : never
        : never
      : never;
  
  type ChildByTag<T extends Crafty.Child[], U extends string> = 
    Flatten<T> extends readonly (infer U)[]
      ? U extends { tag: infer TG }
        ? TG extends U
          ? U 
          : never
        : never
      : never

  type NormalizedElement<T extends HTMLTag, U extends Crafty.Props<T>, V extends Crafty.Child[]> = 
    HTMLElementOf<T> & { children: V } & U

  //! Classes
  export abstract class Node<
    T extends Crafty.Child[] = []
  > {
    constructor(children?: T) {}
    children: T;

    abstract get(prop: Key) { };
    abstract set(prop: Key, val: any) { };
    abstract normalize() { };
    abstract wrap(tag: HTMLTag) { };

    append<U extends Crafty.Child>(child: U): asserts this is Node<T & U>;
    prepend<U extends Crafty.Child>(child: U): asserts this is Node<U & T>;
  }
  export class Element<
    T extends HTMLTag,
    P extends Crafty.Props<T> = Props<T>,
    C extends Crafty.Child[] = []
  > extends Crafty.Node<C> {

    constructor(tag: T, props: P = {} as P, children?: C): Crafty.Element<T, P, C>;

    id: P["id"] | undefined;
    classList: P["classes"] | [];

    get<K extends Exclude<keyof P, "css">>(prop: K): P[K];
    set<K extends Exclude<keyof P, "css">>(prop: K, value: P[K]): void;

    normalize(): Crafty.NormalizedElement<T, P, C>
  }
  export class Fragment<
    C extends Child[] = []
  > extends Crafty.Node<C> implements Renderable<DocumentFragment> { 
    constructor(children?: C): Crafty.Fragment<C>

    override normalize(): Crafty.NormalizedElement<T, P, C>
  }

  export class Unknown {}
  export function craft<T extends HTMLTag, U extends Crafty.Props<T>, V extends Crafty.Child[]>(tag: T, props?: U, children?: V): Crafty.Element<T, U, V>;
  export function craft<T extends Crafty.Child[]>(...children: T): Crafty.Fragment<T>;

  export function from(element: HTMLElement): Crafty.Unknown;
  export function from(html: string): Crafty.Unknown;
  export function from(frag: DocumentFragment): Crafty.Unknown;
}

declare var Crafty: Crafty;