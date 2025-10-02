(function() {
  globalThis.Crafty = Opti.Crafty;
})();
namespace Opti {
  export class Crafty {
    private constructor() {}

    static Node = class Node<T extends Crafty.ChildList = []> {
      public children: T;

      constructor(children?: T) {
        this.children = children ?? ([] as unknown as T);
      }

      append<U extends Crafty.Child>(child: U): asserts this is Node<T & U> {
        this.children.push(child);
      }
      prepend<U extends Crafty.Child>(child: U): asserts this is Node<U & T> {
        this.children.unshift(child);
      }
    };

    static Element = class Element<
      T extends HTMLTag,
      P extends Crafty.Props<T> = Crafty.Props<T>,
      C extends Crafty.ChildList = []
    > extends Crafty.Node<C> {
      public id: P["id"] | null;
      public classList: P["classList"] | [];
      private readonly tag: T;
      private readonly props: P;

      constructor(tag: T, props: P = {} as P, children?: C) {
        super(children ?? [] as unknown as C);
        this.tag = tag;
        this.props = props;
        this.id = (props.id ?? null) as P["id"] | null;
        this.classList = (props.classList ?? []) as P["classList"] | [];
      }

      get<K extends keyof P>(prop: K): P[K] {
        return this.props[prop];
      }
      set<K extends keyof P>(prop: K, value: P[K]): void {
        this.props[prop] = value;
      }

      getById<U extends Crafty.ChildIds<C>>(id: U): Crafty.ChildByID<C, U> {
        return this.children.find(child => child.id === id);
      }

      getByClass<U extends Crafty.Classes<C>>(className: U): Crafty.ChildByClass<C, U>[] {
        function search(list: Crafty.ChildList): Crafty.Child[] {
          let results: Crafty.Child[] = [];
          for (const item of list) {
            if (Array.isArray(item)) {
              results = results.concat(search(item));
            } else {
              const cls = item.classList;
              if (typeof cls === "string" && cls === className) {
                results.push(item);
              } else if (Array.isArray(cls) && cls.includes(className)) {
                results.push(item);
              }
            }
          }
          return results;
        }
        return search(this.children);
      }

      render() {
        const el = document.createElement(this.tag);
        
        Object.entries(this.props).forEach(([key, value]) => {
          el.setAttribute(key, Array.isArray(value) ? value.join(" ") : value);
        });

        el.append(...this.children);

        return el as Crafty.NormalizedElement<T, P, C>;
      }
    };

    static Fragment = class Fragment<
      T extends HTMLTag,
      P extends Crafty.Props<T> = Crafty.Props<T>,
      C extends Crafty.ChildList = []
    > extends Crafty.Node<C> {
      render() {
        const frag = document.createDocumentFragment();
        const subchildren: (DocumentFragment | HTMLElement)[] = this.children.map((v: Crafty.Child) => v.render());

        for (const child of subchildren) {
          frag.append(child);
        };

        return frag;
      }
    };

    static Unknown = class Unknown extends Crafty.Node<never[]> {
      protected constructor() {
        super([]);
      }

    };

    static UnknownElement = class UnknownElement extends Crafty.Unknown {

    };

    static UnknownFragment = class UnknownFragment extends Crafty.Unknown {

    };

    static craft<C extends Crafty.ChildList>(children: C): Crafty.Fragment<C>;
    static craft<T extends HTMLTag, U extends Crafty.Props<T>, V extends Crafty.ChildList>(
      tag: T, 
      props?: U, 
      children?: V
    ): Crafty.Element<T, U, V>;
    static craft<T extends HTMLTag, U extends Crafty.Props<T>, V extends Crafty.ChildList>(
      tagOrChildList: T | V,
      propsOrChild?: U,
      children?: V
    ): Crafty.Element<T, U, V> | Crafty.Fragment<V> {
      if (typeof tagOrChildList === "string") {
        //@ts-ignore
        return new Crafty.Element((tagOrChildList as T), propsOrChild as U, children);
      } else {
        //@ts-ignore
        return new Crafty.Fragment(tagOrChildList);
      }
    }
  }
}
