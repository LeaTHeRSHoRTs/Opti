export abstract class Node<
  T extends Crafty.Child[] = Crafty.Child[]
> {
  public children: T;

  constructor(children?: T) {
    this.children = children ?? ([] as unknown as T);
  }

  abstract get(prop: Key): any;
  abstract set(prop: Key, val: any): void;
  abstract normalize(): Crafty.NormalizedElement<any, any, T> | DocumentFragment;
  abstract wrap(element: HTMLTag): Crafty.Element<any, any, [this]>;

  append<U extends Crafty.Child>(child: U): asserts this is Node<T & U> {
    this.children.push(child);
  }
  prepend<U extends Crafty.Child>(child: U): asserts this is Node<U & T> {
    this.children.unshift(child);
  }

  appendTo(node: Crafty.Node<Crafty.Child[]>) {
    node.children.push(this);
  }

  prependTo(node: Crafty.Node<Crafty.Child[]>) {
    node.children.push(this);
  }

  getElementById<U extends Crafty.ChildIds<T>>(id: U): Crafty.ChildByID<T, U> {
    return this.children.find(child => child.id === id);
  }

  getElementsByClassName<U extends Crafty.Classes<T>>(className: U): Crafty.ChildByClass<T, U>[] {
    function search(list: Crafty.Child[]): Crafty.Child[] {
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

  getElementsByTagName<U extends Crafty.Classes<T>>(tag: U): Crafty.ChildByTag<T, U>[] {
    function search(list: Crafty.Child[]): Crafty.Child[] {
      let results: Crafty.Child[] = [];
      for (const item of list) {
        if (Array.isArray(item)) {
          results = results.concat(search(item));
        } else {
          if (item.tagName === tag) {
            results.push(item);
          }
          if (item.children) {
            results = results.concat(search(item.children));
          }
        }
      }
      return results;
    }
    return search(this.children);
  }
}

export class Element<
  T extends HTMLTag,
  P extends Crafty.Props<T> = Crafty.Props<T>,
  C extends Crafty.Child[] = []
> extends Node<C> {
  public readonly tag: T;
  private props: Omit<P, "css">;
  public classList: P["classes"] | [];
  private internalCss: CSSStyleDeclaration;
  
  constructor(tag: T, props: P = {} as P, children?: C) {
    super(children ?? [] as unknown as C);
    this.tag = tag;
    this.classList = (props.classes ?? []) as P["classes"] | [];
    this.props = f(() => {
      const { css, ...otherProps } = props; 
      return otherProps; 
    });
    this.internalCss = f(() => {
      const styles = document.createElement("div").style;
      Object.forEach(props.css ?? {}, (k, v) => {
        if (v !== undefined && v !== null && k !== "length") {
          styles[k] = v.toString();
        }
      });
      return styles;
    });
    if (!this.props.classes) {
      //@ts-ignore
      this.props.classes = new Array();
    }
    assert(this.props.classes !== undefined);
  }

  override get<K extends keyof Omit<P, "css">>(prop: K): P[K] {
    return this.props[prop];
  }

  override set<K extends keyof Omit<P, "css">>(prop: K, value: P[K]): void {
    this.props[prop] = value;
  }

  override normalize(): Crafty.NormalizedElement<T, P, C> {
    const el = document.createElement(this.tag);

    Object.entries(this.props).forEach(([key, value]) => {
      el.setAttribute(key, Array.isArray(value) ? value.join(" ") : value);
    });

    el.append(...this.children);

    return el as Crafty.NormalizedElement<T, P, C>;
  }

  override wrap<T extends HTMLTag>(element: T): Crafty.Element<T, {}, [this]> {
    return Crafty.craft(element, {}, [this]);
  }

  get id(): P["id"] | undefined {
    return this.props.id;
  }

  getClasses(): P["classes"] | undefined {
    return this.props.classes;
  }

  addClass(cls: string): void {
    this.props.classes?.push(cls);
  } 

  // css(
  //   key?: keyof CSSStyleDeclaration | Partial<Record<keyof CSSStyleDeclaration, string | number>>,
  //   value?: string | number
  // ): any {
  //   const css = this.internalCss;

  //   if (!key) {
  //     const result: Partial<Record<keyof CSSStyleDeclaration, string>> = {};
  //     for (let i = 0; i < Object.keys(css ?? {}).length; i++) {
  //       const prop = css?.[i];
  //       if (prop) {
  //         result[prop as keyof CSSStyleDeclaration] = css.getPropertyValue(prop).trim();
  //       }
  //     }
  //     return result;
  //   }
  
  //   if (typeof key === "string") {
  //     if (value === undefined) {
  //       // Get one value
  //       return css.getPropertyValue(key).trim();
  //     } else {
  //       // Set one value
  //       if (key in css) {
  //         css.setProperty(toKebabCase(key), value.toString());
  //       }
  //     }
  //   } else {
  //     // Set multiple
  //     for (const [prop, val] of Object.entries(key)) {
  //       if (val !== null && val !== undefined) {
  //         css.setProperty(toKebabCase(prop), val.toString());
  //       }
  //     }
  //   }
  // };
};

export class Fragment<
  T extends HTMLTag,
  P extends Crafty.Props<T> = Crafty.Props<T>,
  C extends Crafty.Child[] = []
> extends Node<C> {

  override get(prop: Key): void {
    throw new NotImplementedException("function `get` does not work on object of type `Crafty.Fragment`");
  }

  override set(prop: Key): void {
    throw new NotImplementedException("function `set` does not work on object of type `Crafty.Fragment`");
  }

  override normalize() {
    const frag = document.createDocumentFragment();
    const subchildren: (DocumentFragment | HTMLElement)[] = this.children.map((v: Crafty.Child) => v.render());

    for (const child of subchildren) {
      frag.append(child);
    };

    return frag;
  }

  override wrap<T extends HTMLTag>(element: T): Crafty.Element<T, {}, [this]> {
    return Crafty.craft(element, {}, [this]);
  }
};