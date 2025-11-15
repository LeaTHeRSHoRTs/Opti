import { expectTypeOf } from "expect-type";

describe("f", () => {
  it("should immediately invoke a function", () => {
    let called = false;
    f(() => { called = true; });
    expect(called).toBeTruthy();
  });

  it("should be able to return a value", () => {
    expect(f(() => "Returned")).toBe("Returned");
  });
});

describe('type', () => {
  it('should return the data type for a data type\'s input', () => {
    expect(type(42).stringOf()).toBe("Number");
    expect(type(true).stringOf()).toBe("Boolean");
    expect(type(false).stringOf()).toBe("Boolean");
    expect(type(/test/).stringOf()).toBe("RegExp");
  });

  it('should return the data type plus the length from a data type\'s input', () => {
    expect(type("").stringOf()).toBe("String(0)");
    expect(type([2, 3, 4]).stringOf()).toBe("Array(3)");
    expect(type({ name: "John", age: 30 }).stringOf()).toBe("Object(2)");
    expect(type({}).stringOf()).toBe("Object(0)");
    expect(type([]).stringOf()).toBe("Array(0)");
  });

  it('should return "null" | "undefined" for a null | undefined input', () => {
    expect(type(null).stringOf()).toBe("null");
    expect(type(undefined).stringOf()).toBe("undefined");
  });

  it('should return "Function:<anonymous>..." for an anonymous function', () => {
    expect(type(() => { }).stringOf()).toBe("Function:<anonymous>()");
  });

  it('should return "Function:myFunction(a, b)" for a named function with arguments a and b', () => {
    function myFunction(a: any, b: any) { }
    expect(type(myFunction).stringOf()).toBe("Function:myFunction(a,b)");
  });

  it('should return Map or Set and the size for a Map or Set input input', () => {
    const map = new Map();
    map.set("key1", "value1");
    map.set("key2", "value2");
    expect(type(map).stringOf()).toBe("Map(2)");
    const set = new Set([1, 2, 3]);
    expect(type(set).stringOf()).toBe("Set(3)");
  });

  it('should return "Date:2021-09-01" for a valid Date input', () => {
    const date = new Date('2021-09-01');
    expect(type(date).stringOf()).toBe("Date:2021-09-01");
  });

  it('should return "Date" for an invalid Date input', () => {
    const invalidDate = new Date('invalid-date');
    expect(type(invalidDate).stringOf()).toBe("Date");
  });

  it("should return a boolean to match other objects", () => {
    expect(type("").is("type:String(0)")).toBeTruthy();
    expect(type("").is("")).toBeTruthy();
    expect(type("Hello").isType("String(5)")).toBeTruthy();
    expect(type(32).is(32)).toBeTruthy();
    expect(type(32).is(33)).toBeFalsy();
    expect(type(true).is(true)).toBeTruthy();
    expect(type(true).is(false)).toBeFalsy();
    expect(type(() => { }).is(() => { })).toBeTruthy();
    expect(type((_: any) => { }).is(() => { })).toBeFalsy();
  });

  it("should return a boolean to match lengthed objects", () => {
    expect(type("Hello").isLength(5)).toBeTruthy();
    expect(type([1, 2, 3]).isLength(5)).toBeFalsy();
  });
});

describe("assert", () => {
  it("should throw if the condition is false", () => {
    expect(() => {
      const myString: string = "Hello";
      const yourString: string = "Goodbye";
      assert(myString === yourString);
    }).toThrow(AssertionException);
  });

  it("should not throw if the condition is true", () => {
    expect(() => {
      const myString: string = "Hello";
      const yourString: string = "Hello";
      assert(myString === yourString);
    }).not.toThrow(AssertionException);
  });
});

describe("sleep", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "setTimeout");
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("should wait the specified number of milliseconds before executing", async () => {
    const promise = sleep(5000);

    // Immediately check setTimeout call
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);

    // Advance all timers, resolving the promise
    jest.runAllTimers();

    await expect(promise).resolves.toBeUndefined();
  });

  it("should run code afterwards at the set time", async () => {
    const callback = jest.fn();

    const promise = sleep(5000).then(callback);

    expect(callback).not.toHaveBeenCalled();

    jest.runAllTimers();

    await promise; // ensures microtasks resolve

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("isEmpty, notEmpty", () => {
  const cases = [
    { name: "isEmpty", func: isEmpty, truthy: true },
    { name: "notEmpty", func: notEmpty, truthy: false },
  ];

  it.each(cases)("should correctly evaluate empty values using $name", ({ func, truthy }) => {
    const emptyValues = ["", NaN, 0, null, undefined, false, [], {}];
    for (const val of emptyValues) {
      expect(func(val)).toBe(truthy);
    }
  });

  it.each(cases)("should correctly evaluate non-empty values using $name", ({ func, truthy }) => {
    const nonEmptyValues = [
      "Hello",
      [1, 2],
      { key: "value" },
      true,
      1,
      () => { },
      Symbol("x"),
      new Date(),
    ];
    for (const val of nonEmptyValues) {
      expect(func(val)).toBe(!truthy);
    }
  });
});

describe("opti", () => {
  it("should exist", () => {
    expect(opti).toBeDefined();
  });

  it("should have all false properties", () => {
    expect(opti.crafty).toBeFalsy();
    expect(opti.evented).toBeFalsy();
    expect(opti.flow).toBeFalsy();
    expect(opti.query).toBeFalsy();
    expect(opti.requests).toBeFalsy();
  });
});

describe("Enum", () => {
  it("should create properties", () => {
    const myEnum = Enum("A", "B", "C");

    expect(typeof myEnum.A).toBe("symbol");
    expect(typeof myEnum.B).toBe("symbol");
    expect(typeof myEnum.C).toBe("symbol");
  });

  it("should make unique properties", () => {
    const myEnum = Enum("A", "B");

    expect(myEnum.A === myEnum.B).toBeFalsy();
  });

  it("should throw when the wrong characters are added", () => {
    expect(() => {
      Enum("A", "B", "{}");
    }).toThrow();
  });
});

describe("Tuple", () => {
  const tuple = Tuple("A", "B", "C");

  it("should create a correct tuple", () => {
    expectTypeOf<typeof tuple>().toEqualTypeOf<[string, string, string]>();
    expectTypeOf<typeof tuple>().not.toEqualTypeOf<string[]>();
    expect(tuple).toEqual(["A", "B", "C"]);
  });

  it("should be able to access the values inside the tuple", () => {

  });
});

describe("Collection", () => {
  beforeAll(() => {
    document.body.append(document.createElement("h1"));
    document.body.append(document.createElement("div"));
    document.body.append(document.createElement("div"));
    document.body.append(document.createElement("div"));
  });

  const htmlCollection: Collection<HTMLElement> = Collection.from(document.querySelectorAll("div"));
  const stringCollection: Collection<string> = Collection.of("A", "B", "C", "D", "E");
  const numberCollection: Collection<number> = Collection.of(1, 2, 3, 4, 5);
  const multiCollection: Collection<string | number | boolean> = Collection.of(1, "A", true);

  it("should be able to make collections using `from` and `of`", () => {
    expect(Collection.of()).toBeInstanceOf(Collection);
    expect(Collection.of(1, 2, 3)).toBeInstanceOf(Collection);
    expect(Collection.of("X", true, 3)).toBeInstanceOf(Collection);

    expect(Collection.from([])).toBeInstanceOf(Collection);
    expect(Collection.from([1, 2, 3])).toBeInstanceOf(Collection);
    expect(Collection.from(["X", true, 3])).toBeInstanceOf(Collection);
  });

  it("should construct the right types using the constructors", () => {
    expectTypeOf(Collection.of()).toBeAny;
    expectTypeOf(Collection.of(1, 2, 3)).toBeNumber;

    expectTypeOf(Collection.from([])).toBeAny;
    expectTypeOf(Collection.from([1, 2, 3])).toBeNumber;
  });
});