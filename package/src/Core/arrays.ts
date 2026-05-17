import { arrType } from "../helpers";

export function unique<T>(this: T[]): T[] {
  return [...new Set(this)];
};

export function pluck<T>(this: T[], finder: (v: T) => boolean): T | null {
  const res = this.findIndex(finder);

  if (res === -1) return null;

  const [item] = this.splice(res, 1);
  return item ?? null;
}

export function pluckLast<T>(this: T[], finder: (v: T) => boolean): T | null {
  const index = this.map(finder).lastIndexOf(true);

  if (index === -1) return null;

  const [item] = this.splice(index, 1);
  return item ?? null;
}

export function relocate<T>(this: T[], index: number, offset: number): number | null {
  const value = this.splice(index, 1)[0];
  if (value !== undefined) {
    this.splice(index + offset, 0, value);
    return index + offset;
  } else {
    return null;
  }
}

export function relocateTo<T>(this: T[], index: number, location: number): number | null {
  const value = this.splice(index, 1)[0];
  if (value !== undefined) {
    this.splice(location, 0, value);
    return location;
  } else return null;
}

const originalSort = Array.prototype.sort;
export function sortBy<T>(this: T[], order?: SortMode<T> | ((a: T, b: T) => number)): T[] {
  if (typeof order === "function") {
    return originalSort.call(this, order);
  } else if (order === undefined) {
    return originalSort.call(this);
  }

  const copy = [...this];
  if (arrType(this, Date)) {
    switch (order) {
      case "earlier": return originalSort.call(copy, (a, b) => a.getTime() - b.getTime());
      case "later": return originalSort.call(copy, (a, b) => b.getTime() - a.getTime());
    }
  } else if (arrType(this, String)) {
    switch (order) {
      case "alpha": return originalSort.call(copy);
      case "alpha-reverse": return originalSort.call(copy).reverse();
    }
  } else if (arrType(this, Number)) {
    switch (order) {
      case "increasing": return originalSort.call(copy, (a, b) => a - b);
      case "decreasing": return originalSort.call(copy, (a, b) => b - a);
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

    return oldVal ?? null;
  }
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

export function insert<U>(this: U[], index: number, ...values: U[]): void {
  this.splice(index, 0, ...values);
}