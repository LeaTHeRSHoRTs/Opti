import "opti";

describe("Array.unique", () => {
  it("should filter out the non-unique values", () => {
    const arr = [1, 2, 2, 3];
    expect(arr.unique()).toStrictEqual([1, 2, 3]);
  });

  it("should be able to handle arrays of multiple types", () => {
    const arr = [1, 2, true, true, 1, 3, "a", "b", false, 3, "a"];
    expect(arr.unique()).toEqual([1, 2, true, 3, "a", "b", false]);
  });
});

describe("Array.chunk", () => {
  it("should throw when the chunk size is too small", () => {
    expect(() => {
      const arr = [1, 2, 3, 4, 5];
      arr.chunk(0);
    }).toThrowException(NumberTooSmallException);

    expect(() => {
      const arr = [1, 2, 3, 4, 5];
      arr.chunk(-2);
    }).toThrowException(NumberTooSmallException);
  });

  it("should turn a normal array into a multidimensional array", () => {
    const arr = [1, 2, 3, 4, 5];
    const newArr = arr.chunk(2);

    expect(newArr).toStrictEqual([[1, 2], [3, 4], [5]]);
  });

  it("should turn a multidimensional array into a more multidimensional array", () => {
    const arr = [[1, 2], [3, 4], [5, 6], [7, 8]];
    const newArr = arr.chunk(2);

    expect(newArr).toStrictEqual([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]);
  });
});

describe("Array.pluck", () => {
  let arr: (number | string | boolean)[];

  beforeEach(() => {
    arr = [1, true, 3, 4, false, 5];
  });

  it("should be able to take values from arrays", () => {
    const val = arr.pluck(v => typeof v === "boolean");
    expect(val).toBe(true);
    expect(arr).not.toContain(true);
  });

  it("should gracefully handle errors when the value isn't available", () => {
    const val = arr.pluck(v => typeof v === "function" && v === true);
    expect(val).toBe(null);
    expect(arr).toContain(true);
  });
});

describe("Array.pluckLast", () => {
 let arr: (number | string | boolean)[];

  beforeEach(() => {
    arr = [1, true, 3, 4, false, 5];
  });

  it("should be able to take values from arrays", () => {
    const val = arr.pluckLast(v => typeof v === "boolean");
    expect(val).toBe(false);
    expect(arr).not.toContain(false);
  });

  it("should return null when the item is not found", () => {
    const val = arr.pluckLast(v => v === 7);
    expect(val).toBe(null);
    expect(arr).toStrictEqual([1, true, 3, 4, false, 5]);
  });
});

describe("Array.insert", () => {
  it("should be able to insert elements into an array at index", () => {
    const arr = [1, 2, 3, 5];
    arr.insert(3, 4);
    expect(arr).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it("should be able to push multiple values", () => {
    const arr = [1, 2, 3, 7];
    arr.insert(3, 4, 5, 6);
    expect(arr).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});

describe("Array.relocate", () => {
  it("should be able to relocate a value by an offset", () => {
    const arr = ["A", "B", "D", "C"];
    const location = arr.relocate(3, -1);
    expect(arr).toStrictEqual(["A", "B", "C", "D"]);
    expect(location).toBe(2);
  });

  it("should return null if it could not find the index specified", () => {
    const arr = [1, 2, 3, 4];
    const location = arr.relocate(4, -2);
    expect(arr).toStrictEqual([1, 2, 3, 4]);
    expect(location).toBe(null);
  });
});

describe("Array.relocateTo", () => {
  it("should be able to relocate a value to an index", () => {
    const arr = ["A", "B", "D", "C"];
    arr.relocateTo(3, 2);
    expect(arr).toStrictEqual(["A", "B", "C", "D"]);
  });

  it("should return null if it could not find the index specified", () => {
    const arr = [1, 2, 3, 4];
    const location = arr.relocateTo(4, 2);
    expect(arr).toStrictEqual([1, 2, 3, 4]);
    expect(location).toBe(null);
  });
});

describe("Array.replace", () => {
  it("should be able to replace the first value that succeed the searcher function", () => {
    const arr1 = [1, 2, 3, 100, 5];
    const arr2 = ["A", "B", "C", "Y", "E"];
    const arr3: object[] = [{ a: 1, b: 2 }, { y: 100, z: 101 }];

    const value1 = arr1.replace(v => v > 5, 4);
    const value2 = arr2.replace(v => v.includes("Y"), "D");
    const value3 = arr3.replace(v => ("y" in v) && ("z" in v), { c: 3, d: 4 });

    expect(value1).toBe(100);
    expect(value2).toBe("Y");
    expect(value3).toStrictEqual({ y: 100, z: 101 });

    expect(arr1).toStrictEqual([1, 2, 3, 4, 5]);
    expect(arr2).toStrictEqual(["A", "B", "C", "D", "E"]);
    expect(arr3).toStrictEqual([{ a: 1, b: 2 }, { c: 3, d: 4 }]);
  });

  it("should be able to replace based on the index of the item to replace", () => {
    const arr1 = [1, 2, 3, 100, 5];
    const arr2 = ["A", "B", "C", "Y", "E"];
    const arr3: object[] = [{ a: 1, b: 2 }, { y: 100, z: 101 }];

    const value1 = arr1.replace(3, 4);
    const value2 = arr2.replace(3, "D");
    const value3 = arr3.replace(1, { c: 3, d: 4 });

    expect(value1).toBe(100);
    expect(value2).toBe("Y");
    expect(value3).toStrictEqual({ y: 100, z: 101 });

    expect(arr1).toStrictEqual([1, 2, 3, 4, 5]);
    expect(arr2).toStrictEqual(["A", "B", "C", "D", "E"]);
    expect(arr3).toStrictEqual([{ a: 1, b: 2 }, { c: 3, d: 4 }]);
  });
});

describe("Array.sort", () => {
  it("should be able to work normally", () => {
    expect(["A", "D", "C", "B"].sort()).toStrictEqual(["A", "B", "C", "D"]);
    expect([1, 4, 3, 2].sort()).toStrictEqual([1, 2, 3, 4]);
    expect([].sort()).toStrictEqual([]);
  });

  it("should fallback for mixed type arrays", () => {
    const arr = [1, "2", 3];
    const result = [...arr].sort("increasing");
    expect(result).toEqual([1,"2",3]);
  });

  it("should be able to sort numbers my numerical order", () => {
    expect([1, 7, 2, 3, 5, 4, 6].sort('increasing')).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
    expect([1, 7, 2, 3, 5, 4, 6].sort('decreasing')).toStrictEqual([7, 6, 5, 4, 3, 2, 1]);
  });

  it("should be able to sort alphabetically", () => {
    expect(["E", "B", "A", "C", "D"].sort('alpha')).toStrictEqual(["A", "B", "C", "D", "E"]);
    expect(["E", "B", "A", "C", "D"].sort('alpha-reverse')).toStrictEqual(["E", "D", "C", "B", "A"]);
  });

  it("should be able to sort dates", () => {
    const now = new Date();
    const earlier = new Date(0);
    const later = new Date(Date.now() + 100);
    expect([now, earlier, later].sort('earlier')).toStrictEqual([earlier, now, later]);
    expect([now, earlier, later].sort('later')).toStrictEqual([later, now, earlier]);
  });

  it("should be able to sort normally still", () => {
    expect(["A", "C", "B", "D", "E"].sort()).toStrictEqual(["A", "B", "C", "D", "E"]);
    expect([1, 4, 5, 3, 2].sort((a, b) => a - b)).toStrictEqual([1, 2, 3, 4, 5]);
  });
});

// describe("Array.type", () => {
//   it("should be able to return the type of array", () => {
//     expect([1, 2, 3].type).toEqual(["number"]);
//     expect(["A", "B", "C"].type).toEqual(["string"]);
//     expect([true, false, false].type).toEqual(["boolean"]);
//     expect([String, String, String].type).toEqual(["StringConstructor"]);
//     expect([() => undefined, (a: unknown, b: unknown) => undefined, (x: unknown, y: unknown, z: unknown) => undefined].type).toEqual(["Function"]);
//   });

//   it("should be able to handle arrays with multiple different types", () => {
//     expect([1, "B", new Date()].type).toEqual(["Date", "number", "string"]);
//   });
// });