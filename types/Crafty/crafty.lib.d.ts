/* eslint-disable no-var */

namespace Crafty {
  export type Child =  Crafty.Element | Crafty.Fragment;
  export type ChildList = Child[];
  export type Props<T extends HTMLTag> = {
      classList?: string | string[],
      text?: string,
      id?: string,
      name?: string,
    } & Partial<Pick<HTMLElementOf<T>, AccessorKeys<HTMLElementOf<T>>>>

  export type ChildIds<T extends Crafty.ChildList> =
    T extends readonly (infer U)[]
      ? U extends { id?: infer ID } & Crafty.Node<infer C>
        ? ID | ChildIds<U["children"]>
        : never
      : never;

  type Example = ChildIds<[Element<"a", { id: "new" }, [Element<"a", { id: "example" }, []>]>]>

  export type Classes<T extends Crafty.ChildList> =
    Flatten<T> extends readonly (infer U)[]
      ? U extends { classList: infer V }
        ? V extends string
          ? V
          : V extends readonly string[]
            ? V[number]
            : never
        : never
      : never;

  type ChildByID<T extends Crafty.ChildList, I> =
    readonly T extends readonly (infer U)[]
      ? U["id"] extends infer V
        ? V extends I
          ? U
          : never
        : never
      : never;
    
  type addsda = Flatten<[Crafty.Element<"div", { id: "newOne" }, []>]>
  type Res = Crafty.ChildByID<[Crafty.Element<"div", { id: "newOne" }, []>], "newOne">

  type ChildByClass<T extends readonly { classList?: unknown }[], C extends string> =
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

  type NormalizedElement<T extends HTMLTag, U extends Crafty.Props<T>, V extends Crafty.ChildList> = 
    HTMLElementOf<T> & { children: V } & U

  //! Classes
  export class Node<
    T extends Crafty.ChildList = []
  > {
    children: T;

    append<U extends Crafty.Child>(child: U): asserts this is Node<T & U>;
    prepend<U extends Crafty.Child>(child: U): asserts this is Node<U & T>;
  }
  export class Element<
    T extends HTMLTag,
    P extends Crafty.Props<T> = Props<T>,
    C extends Crafty.ChildList = []
  > extends Crafty.Node<C> implements Renderable<Crafty.NormalizedElement<T, P, C>> {

    constructor(tag: T, props: P = {} as P, children?: C): Crafty.Element<T, P, C>;

    id: P["id"] | null;
    classList: P["classList"] | [];

    get<K extends keyof P>(prop: K): P[K];
    set<K extends keyof P>(prop: K, value: P[K]): void;

    getById<U extends Crafty.ChildIds<C>>(id: U): Crafty.ChildByID<C, U>;
    getByClass<U extends Crafty.Classes<C>>(className: U): Crafty.ChildByClass<C, U>[];
  }
  export class Fragment<
    C extends ChildList = []
  > extends Crafty.Node<C> implements Renderable<DocumentFragment> { 
    constructor(children?: C): Crafty.Fragment<C>
  }

  export class Unknown {}
  export function craft<T extends HTMLTag, U extends Crafty.Props<T>, V extends Crafty.ChildList>(tag: T, props?: U, children?: V): Crafty.Element<T, U, V>;
  export function craft<T extends Crafty.ChildList>(...children: T): Crafty.Fragment<T>;

  export function from(element: HTMLElement): Crafty.Unknown;
  export function from(html: string): Crafty.Unknown;
  export function from(frag: DocumentFragment): Crafty.Unknown;
}

declare var Crafty: Crafty;