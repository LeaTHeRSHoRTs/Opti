describe("Array.unique", () => {
  it("should filter out the non-unique values", () => {
    const arr = [1, 2, 2, 3];
    const uniqueArr = arr.unique();

    expect(uniqueArr).toStrictEqual([1, 2, 3]);
  });
});

describe("Array.chunk", () => {
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
});

describe("Array.insert", () => {
  it("should be able to insert elements into an array at index", () => {
    const arr = [1, 2, 3, 5];
    arr.insert(2, 4);
    expect(arr).toStrictEqual([1, 2, 3, 4, 5]);
  });
});

describe("Array.relocate", () => {
  const arr = ["A", "B", "D", "C"];
  arr.relocate(3, -1);
  expect(arr).toStrictEqual(["A", "B", "C", "D"]);
});

describe("Array.relocateTo", () => {
  const arr = ["A", "B", "D", "C"];
  arr.relocateTo(3, 2);
  expect(arr).toStrictEqual(["A", "B", "C", "D"]);
});

describe("Array.replace", () => {

});

describe("Array.replaceLast", () => {

});