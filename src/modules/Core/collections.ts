export function addClassList<T extends Element>(this: Iterable<T>, elClass: string): void {
  for (const el of this) {
    el.addClass(elClass);
  }
};

export function removeClassList<T extends Element>(this: Iterable<T>, elClass: string): void {
  for (const el of this) {
    el.removeClass(elClass);
  }
};

export function toggleClassList<T extends Element>(this: Iterable<T>, elClass: string): void {
  for (const el of this) {
    el.toggleClass(elClass);
  }
};