///<reference path="./crafty.d.ts" />
///<reference path="./basicnodes.d.ts" />
///<reference path="./elements.d.ts" />
///<reference path="./exceptions.d.ts" />

interface Crafty {
  craft<T extends HTMLTag, U extends Crafty.Props<T> = {}>(el: T, props: U, children: Crafty.Children ): Crafty.HTMLElement<T, U>;
  craft<N extends Crafty.Namespace, T extends Crafty.TagFromNamespace<N>, U extends Crafty.Props<T> = {}>(namespace: N, el: T, props: U, children: Crafty.Children ): Crafty.Element<N, T, U>
  craft(...children: Crafty.Children ): Crafty.Fragment;
  craft(str: string): Crafty.Text;

  from(html: string): Crafty.Unknown;
  from(el: Element): Crafty.Unknown;
  from<T extends Crafty.Node>(node: T): T;
  
  //Classes
  Unknown: Crafty.UnknownStatic;
  Comment: Crafty.CommentStatic;
  Text: Crafty.TextStatic;
  Fragment: Crafty.FragmentStatic;
  Element: Crafty.ElementStatic;
  HTMLElement: Crafty.HTMLElementStatic;
  VoidHTMLElement: Crafty.VoidHTMLElementStatic;

  // Exceptions
  Exception: Crafty.ExceptionConstructor;
  ChildrenNotAllowedException: Crafty.ChildrenNotAllowedExceptionConstructor;
  NormalizationException: Crafty.NormalizationExceptionConstructor;
}

declare var Crafty: Crafty;