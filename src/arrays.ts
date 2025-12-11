export function unique<T>(this: T[]): T[] {
  return [...new Set(this)];
};

export function pluck<T>(this: T[], finder: (v: T) => boolean): T | null {
  const res = this.findIndex(finder);

  if (res === -1) return null;

  const [item] = this.splice(res, 1);
  return item;
}

export function pluckLast<T>(this: T[], finder: (v: T) => boolean): T | null {
  // find index of last matching element
  const index = this.map(finder).lastIndexOf(true);
  if (index === -1) return null;

  // remove and return it
  const [item] = this.splice(index, 1);
  return item;
}

export function relocate<T>(this: T[], index: number, offset: number): number | null {
  const value = this.splice(index, 1)[0] ?? null;
  if (value) {
    this.splice(index + offset, 0, value);
    return index + offset;
  } else return null;
}

export function relocateTo<T>(this: T[], index: number, location: number): number | null {
  const value = this.splice(index, 1)[0] ?? null;
  if (value) {
    this.splice(location, 0, value);
    return location;
  } else return null;
}

type AnyConstructor<T = any> = new (...args: any[]) => T;

export function arrayType(this: any[]) {
  return [...new Set(this.map(v => typed(v).stringOfBasic()))].sort();
}

function arrType<T extends AnyConstructor | StringConstructor | NumberConstructor | BooleanConstructor | SymbolConstructor>(
  array: any[],
  type: T
): array is Unboxed<T>[] {
  return array.every(v =>
    type === String ? typeof v === "string" :
      type === Number ? typeof v === "number" :
        type === Boolean ? typeof v === "boolean" :
          type === Symbol ? typeof v === "symbol" :
            v instanceof type
  );
}

const origionalSort: <T>(this: T[], compareFn?: ((a: any, b: any) => number) | undefined) => any[] = Array.prototype.sort;
export function sortBy<T>(this: T[], order?: SortMode<T> | ((a: T, b: T) => number)): T[] {
  if (typeof order === "function") {
    return origionalSort.call(this, order);
  } else if (order === undefined) {
    return origionalSort.call(this);
  }

  const copy = [...this];
  if (arrType(this, Date)) {
    switch (order) {
      case "earlier": return origionalSort.call(copy, (a, b) => a.getTime() - b.getTime());
      case "later": return origionalSort.call(copy, (a, b) => b.getTime() - a.getTime());
    }
  } else if (arrType(this, String)) {
    switch (order) {
      case "alpha": return origionalSort.call(copy);
      case "alpha-reverse": return origionalSort.call(copy).reverse();
    }
  } else if (arrType(this, Number)) {
    switch (order) {
      case "increasing": return origionalSort.call(copy, (a, b) => a - b);
      case "decreasing": return origionalSort.call(copy, (a, b) => b - a);
    }
  }

  return copy.sort();
}

export function replace<T>(this: T[], index: number | ((value: T) => boolean), newVal: T): T | null {
  if (typeof index === "number") {
    const oldVal = this[index];
    this[index] = newVal;

    return oldVal ?? null;
  } else {
    const i = this.findIndex(index);
    if (i === -1) return null;

    const oldVal = this[i];
    this[i] = newVal;

    return oldVal;
  }
}

export function replaceLast<T>(this: T[], finder: (value: T) => boolean, newVal: T): T | null {
  for (let i = this.length - 1; i >= 0; i--) {
    if (finder(this[i])) {
      const oldVal = this[i];
      this[i] = newVal;
      return oldVal ?? null;
    }
  }
  return null;
}

export function chunk<T>(this: T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) throw new globalThis.NumberTooSmallException("`chunkSize` cannot be a number below 1");

  const newArr: T[][] = [];
  let tempArr: T[] = [];

  this.forEach(val => {
    tempArr.push(val);
    if (tempArr.length === chunkSize) {
      newArr.push(tempArr);
      tempArr = []; // Reset tempArr for the next chunk
    }
  });

  // Add the remaining elements in tempArr if any
  if (tempArr.length) {
    newArr.push(tempArr);
  }

  return newArr;
};

export function insert<U>(this: unknown[], index: number, ...values: U[]) {
  this.splice(index, 0, ...values);
}