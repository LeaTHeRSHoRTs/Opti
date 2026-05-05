declare namespace Query {
    interface PseudoElement {
    css(): CSS.Object;
    css(prop: CSS.PropertyName): string | number | undefined;

    exists(): boolean;
  }
}