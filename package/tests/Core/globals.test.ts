import "opti";

describe("Missing", () => {
  it("should be defined", () => {
    expect(Missing).toBeDefined();
  });

  it("should be readonly", () => {
    expect(() => {
      //@ts-ignore
      Missing = Symbol("NotMissing");
    }).toThrow(TypeError);
  });
});

describe('is', () => {
  let nullVal: ValueQueries<null | true>;
  let undefinedVal: ValueQueries<undefined | true>;
  let numberVal: ValueQueries<number>;
  let zeroVal: ValueQueries<number>;
  let trueVal: ValueQueries<boolean>;
  let falseVal: ValueQueries<boolean>;
  let regexVal: ValueQueries<RegExp>;
  let emptyStringVal: ValueQueries<string>;
  let helloStringVal: ValueQueries<string>;
  let numberArrayVal: ValueQueries<number[]>;
  let objectLiteralVal: ValueQueries<{ name: string, age: number }>;
  let emptyObjectVal: ValueQueries<object>;
  let emptyArrayVal: ValueQueries<any[]>;
  let anonymousFuncVal: ValueQueries<() => void>;
  let anonymousFuncParamsVal: ValueQueries<(_: any) => void>;
  let namedFuncVal: ValueQueries<(a: string, b: number) => void>;
  let mapVal: ValueQueries<Map<string, string>>;
  let setVal: ValueQueries<Set<number>>;
  let dateVal: ValueQueries<Date>;
  let badDateVal: ValueQueries<Date>;
  let undefinedArray: ValueQueries<undefined[]>;
  let nullArray: ValueQueries<null[]>;
  let symbolVal: ValueQueries<symbol>;

  beforeEach(() => {
    nullVal = is<null | true>(null);
    undefinedVal = is<undefined | true>(undefined);
    numberVal = is(42);
    zeroVal = is(0);
    trueVal = is(true);
    falseVal = is(false);
    regexVal = is(/test/);
    emptyStringVal = is("");
    helloStringVal = is("Hello");
    numberArrayVal = is([2, 3, 4]);
    objectLiteralVal = is({ name: "John", age: 30 });
    emptyObjectVal = is({});
    emptyArrayVal = is<any[]>([]);
    anonymousFuncVal = is(() => {});
    anonymousFuncParamsVal = is((_: any) => {});
    namedFuncVal = is(function myFunction(a: string, b: number) {});
    mapVal = is(new Map([["key1", "value1"], ["key2", "value2"]]));
    setVal = is(new Set([1, 2, 3]));
    dateVal = is(new Date("2021-09-01"));
    badDateVal = is(new Date("invalid-date"));
    undefinedArray = is([undefined, undefined]);
    nullArray = is([null, null]);
    symbolVal = is(Symbol("symbol"));
  });

  it('should return the data type for a data type\'s input', () => {
    expect(numberVal.stringOf()).toBe("Number");
    expect(trueVal.stringOf()).toBe("Boolean");
    expect(falseVal.stringOf()).toBe("Boolean");
    expect(regexVal.stringOf()).toBe("RegExp");
  });

  it('should return the data type plus the length from a data type\'s input', () => {
    expect(emptyStringVal.stringOf()).toBe("String(0)");
    expect(numberArrayVal.stringOf()).toBe("Array(3)");
    expect(objectLiteralVal.stringOf()).toBe("Object(2)");
    expect(emptyObjectVal.stringOf()).toBe("Object(0)");
    expect(emptyArrayVal.stringOf()).toBe("Array(0)");
  });

  it("should return Symbol(value) for symbols", () => {
    expect(symbolVal.stringOf()).toBe("Symbol(symbol)");
  });

  it('should return the value via the getValue() function', () => {
    expect(numberVal.getValue()).toBe(42);
    expect(trueVal.getValue()).toBe(true);
    expect(falseVal.getValue()).toBe(false);
    expect(regexVal.getValue().toString()).toBe("/test/");
    expect(emptyStringVal.getValue()).toBe("");
    expect(numberArrayVal.getValue()).toEqual([2, 3, 4]);
    expect(objectLiteralVal.getValue()).toEqual({ name: "John", age: 30 });
    expect(emptyObjectVal.getValue()).toEqual({});
    expect(emptyArrayVal.getValue()).toEqual([]);
  });

  it('should return "null" | "undefined" for a null | undefined input', () => {
    expect(nullVal.stringOf()).toBe("null");
    expect(undefinedVal.stringOf()).toBe("undefined");
  });

  it('should return "Function:<anonymous>..." for an anonymous function', () => {
    expect(anonymousFuncVal.stringOf()).toBe("Function:<anonymous>(0)");
  });

  it('should return "Function:myFunction(a, b)" for a named function with arguments a and b', () => {
    expect(namedFuncVal.stringOf()).toBe("Function:myFunction(2)");
  });

  it('should return Map or Set and the size for a Map or Set input input', () => {
    expect(mapVal.stringOf()).toBe("Map(2)");
    expect(setVal.stringOf()).toBe("Set(3)");
  });

  it('should return the right dates for date objects', () => {
    expect(dateVal.stringOf()).toBe("Date:2021-09-01");
    expect(badDateVal.stringOf()).toBe("Date");
  });

  it("should return a boolean to match other objects", () => {
    expect(emptyStringVal.equalTo("")).toBe(true);
    expect(numberVal.equalTo(42)).toBe(true);
    expect(numberVal.equalTo(43)).toBe(false);
    expect(trueVal.equalTo(true)).toBe(true);
    expect(trueVal.equalTo(false)).toBe(false);
    expect(anonymousFuncVal.equalTo(() => { })).toBe(true);
    expect(anonymousFuncParamsVal.equalTo(() => { })).toBe(false);
    expect(nullVal.equalTo(null)).toBe(true);
  });

  it("should be able to compare type strings", () => {
    expect(helloStringVal.isTypeString("String(5)")).toBe(true);
    expect(emptyStringVal.isTypeString("String(0)")).toBe(true);
    expect(numberVal.isTypeString("Number")).toBe(true);
    expect(numberVal.isTypeString("String(42)")).toBe(false);
    expect(trueVal.isTypeString("Boolean")).toBe(true);
    expect(trueVal.isTypeString("String")).toBe(false);
    expect(anonymousFuncVal.isTypeString("Function:<anonymous>(0)")).toBe(true);
    expect(anonymousFuncParamsVal.isTypeString("Function:<anonymous>(1)")).toBe(true);
    expect(namedFuncVal.isTypeString("Function:myFunction(2)")).toBe(true);
    expect(nullVal.isTypeString("null")).toBe(true);
    expect(undefinedVal.isTypeString("undefined")).toBe(true);
  });

  it("should be able to match objects using isInstanceOf", () => {
    expect(numberArrayVal.isInstanceOf(Array)).toBe(true);
    expect(emptyArrayVal.isInstanceOf(Array)).toBe(true);
    expect(emptyArrayVal.isInstanceOf(String)).toBe(false);
    expect(objectLiteralVal.isInstanceOf(Object)).toBe(true);
    expect(emptyObjectVal.isInstanceOf(Object)).toBe(true);
    expect(nullVal.isInstanceOf(Object)).toBe(false);
    expect(numberVal.isInstanceOf(Number)).toBe(true);
    expect(helloStringVal.isInstanceOf(Number)).toBe(false);
    expect(helloStringVal.isInstanceOf(String)).toBe(true);
    expect(emptyArrayVal.isInstanceOf(Array)).toBe(true);
    expect(objectLiteralVal.isInstanceOf(Object)).toBe(true);
    expect(emptyObjectVal.isInstanceOf(Object)).toBe(true);
    expect(anonymousFuncVal.isInstanceOf(Function)).toBe(true);
    expect(anonymousFuncParamsVal.isInstanceOf(Function)).toBe(true);

    expect(anonymousFuncVal.isInstanceOf(Object)).toBe(true);
    expect(helloStringVal.isInstanceOf(Object)).toBe(true);
    expect(numberArrayVal.isInstanceOf(Object)).toBe(true);
    expect(numberVal.isInstanceOf(Object)).toBe(true);
    expect(undefinedVal.isInstanceOf(Object)).toBe(false);
  });

  it("should return a boolean to match objects with lengths", () => {
    expect(helloStringVal.length(5)).toBe(true);
    expect(numberArrayVal.length(5)).toBe(false);
  });

  it("should be able to check if an item is longer than a length", () => {
    expect(helloStringVal.longer(5)).toBe(false);
    expect(helloStringVal.longer(4)).toBe(true);
    expect(emptyArrayVal.longer(1)).toBe(false);
    expect(numberArrayVal.longer(2)).toBe(true);
  });

  it("should be able to check if an item is shorter than a length", () => {
    expect(helloStringVal.shorter(6)).toBe(true);
    expect(helloStringVal.shorter(4)).toBe(false);
    expect(emptyArrayVal.shorter(1)).toBe(true);
    expect(numberArrayVal.shorter(2)).toBe(false);
  });

  it("should be able to check a function's name", () => {
    expect(namedFuncVal.isName("myFunction")).toBe(true);
    expect(anonymousFuncVal.isName("anonymous")).toBe(true);
  });

  it("should be able to check if something is defined", () => {
    expect(emptyStringVal.isDefined()).toBe(true);
    expect(helloStringVal.isDefined()).toBe(true);
    expect(numberVal.isDefined()).toBe(true);
    expect(numberVal.isDefined()).toBe(true);
    expect(trueVal.isDefined()).toBe(true);
    expect(falseVal.isDefined()).toBe(true);
    expect(anonymousFuncVal.isDefined()).toBe(true);
    expect(anonymousFuncParamsVal.isDefined()).toBe(true);
    expect(nullVal.isDefined()).toBe(false);
    expect(undefinedVal.isDefined()).toBe(false);
  });

  it("should be able to check if something is null", () => {
    expect(emptyStringVal.isNull()).toBe(false);
    expect(helloStringVal.isNull()).toBe(false);
    expect(numberVal.isNull()).toBe(false);
    expect(zeroVal.isNull()).toBe(false);
    expect(trueVal.isNull()).toBe(false);
    expect(falseVal.isNull()).toBe(false);
    expect(anonymousFuncVal.isNull()).toBe(false);
    expect(anonymousFuncParamsVal.isNull()).toBe(false);
    expect(nullVal.isNull()).toBeTruthy();
    expect(undefinedVal.isNull()).toBe(false);
  });

  it("should be able to check if something is undefined", () => {
    expect(emptyStringVal.isUndefined()).toBe(false);
    expect(helloStringVal.isUndefined()).toBe(false);
    expect(numberVal.isUndefined()).toBe(false);
    expect(zeroVal.isUndefined()).toBe(false);
    expect(trueVal.isUndefined()).toBe(false);
    expect(falseVal.isUndefined()).toBe(false);
    expect(anonymousFuncVal.isUndefined()).toBe(false);
    expect(anonymousFuncParamsVal.isUndefined()).toBe(false);
    expect(nullVal.isUndefined()).toBe(false);
    expect(undefinedVal.isUndefined()).toBe(true);
  });

  it("should be able to check if something is a falsy value", () => {
    expect(emptyStringVal.isFalsy()).toBe(true);
    expect(helloStringVal.isFalsy()).toBe(false);
    expect(numberVal.isFalsy()).toBe(false);
    expect(zeroVal.isFalsy()).toBe(true);
    expect(trueVal.isFalsy()).toBe(false);
    expect(falseVal.isFalsy()).toBe(true);
    expect(anonymousFuncVal.isFalsy()).toBe(false);
    expect(anonymousFuncParamsVal.isFalsy()).toBe(false);
    expect(nullVal.isFalsy()).toBe(true);
    expect(undefinedVal.isFalsy()).toBe(true);
  });

  it("should be able to check if something is a truthy value", () => {
    expect(emptyStringVal.isTruthy()).toBe(false);
    expect(helloStringVal.isTruthy()).toBe(true);
    expect(numberVal.isTruthy()).toBe(true);
    expect(zeroVal.isTruthy()).toBe(false);
    expect(trueVal.isTruthy()).toBe(true);
    expect(falseVal.isTruthy()).toBe(false);
    expect(anonymousFuncVal.isTruthy()).toBe(true);
    expect(anonymousFuncParamsVal.isTruthy()).toBe(true);
    expect(nullVal.isTruthy()).toBe(false);
    expect(undefinedVal.isTruthy()).toBe(false);
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

describe("f", () => {
  it("should immediately invoke a function", () => {
    let called = false;
    f(() => { called = true; });
    (() => { })();

    expect(called).toBeTruthy();
  });

  it("should be able to return a value", () => {
    expect(f(() => "Returned")).toBe("Returned");
  });
});

describe("sleep", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "setTimeout");
  });

  afterAll(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should wait the specified number of milliseconds before executing", async () => {
    const promise = sleep(5000);

    // Immediately check setTimeout call
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);

    // Advance all timers, resolving the promise
    vi.runAllTimers();

    await expect(promise).resolves.toBeUndefined();
  });

  it("should run code afterwards at the set time", async () => {
    const callback = vi.fn();

    const promise = sleep(5000).then(callback);

    expect(callback).not.toHaveBeenCalled();

    vi.runAllTimers();

    await promise; // ensures microtasks resolve

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should reject immediately if the sleep length is 0 or lower", async () => {
    await sleep(0).catch(err => {
      expect(err).toBeInstanceOf(NumberTooSmallException);
      expect(err.getMessage()).toBe("Invalid timeout value (must be greater than 0)");
    });
    
    await sleep(-10).catch(err => {
      expect(err).toBeInstanceOf(NumberTooSmallException);
      expect(err.getMessage()).toBe("Invalid timeout value (must be greater than 0)");
    });
  });
});

describe("isEmpty", () => {
  it("should correctly evaluate empty values", () => {
    const emptyValues = ["", NaN, 0, null, undefined, false, [], {}];
    for (const val of emptyValues) {
      expect(isEmpty(val)).toBe(true);
    }
  });

  it("should correctly evaluate non-empty values", () => {
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
      expect(isEmpty(val)).toBe(false);
    }
  });
});

describe("Opti", () => {
  it("should exist", () => {
    expect(Opti).toBeDefined();
  });

  it("should have all false properties", () => {
    expect(Opti.crafty).toBeFalsy();
    expect(Opti.unsync).toBeFalsy();
    expect(Opti.flow).toBeFalsy();
    expect(Opti.query).toBeFalsy();
    expect(Opti.requests).toBeFalsy();
  });
});