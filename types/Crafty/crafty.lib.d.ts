///<reference path="./crafty.d.ts" />
///<reference path="./classes.d.ts" />
///<reference path="./elements.d.ts" />
///<reference path="./exceptions.d.ts" />

interface Crafty {
  craft<T extends HTMLTag, U extends Crafty.Props<T> = {}>(el: T, props: U, children: Crafty.Children ): Crafty.HTMLElement<T, U>;
  craft<N extends Crafty.Namespace, T extends Crafty.TagFromNamespace<N>, U extends Crafty.Props<T> = {}>(namespace: N, el: T, props: U, children: Crafty.Children ): Crafty.Element<N, T, U>
  craft(...children: Crafty.Children ): Crafty.Fragment
  craft(str: string): Crafty.Text;

  from(html: string): Crafty.Unknown;
  from(el: Element): Crafty.Unknown;
  from<T extends Crafty.Node>(node: T): T;
  
  Unknown: PrototypeObject<Crafty.Unknown>
  Text: PrototypeObject<Crafty.Text>
  Fragment: PrototypeObject<Crafty.Fragment>
  Element: PrototypeObject<Crafty.Element>
  HTMLElement: PrototypeObject<Crafty.HTMLElement>
  Exception: Crafty.ExceptionConstructor
  ChildrenNotAllowedException: Crafty.ChildrenNotAllowedExceptionConstructor
  NormalizationException: Crafty.NormalizationExceptionConstructor
}

declare var Crafty: Crafty;