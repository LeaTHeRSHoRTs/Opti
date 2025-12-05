import "../../dist/opti";
import { expectTypeOf } from "expect-type";
import "./jest.d.ts";

describe('type', () => {
  const nullVal: TypeGuard<null | true> = typed<null | true>(null);
  const undefinedVal: TypeGuard<undefined | true> = typed<undefined | true>(undefined);
  const numberVal: TypeGuard<number> = typed(42);
  const zeroVal: TypeGuard<number> = typed(0);
  const trueVal: TypeGuard<boolean> = typed(true);
  const falseVal: TypeGuard<boolean> = typed(false);
  const regexVal: TypeGuard<RegExp> = typed(/test/);
  const emptyStringVal: TypeGuard<string> = typed("");
  const helloStringVal: TypeGuard<string> = typed("Hello");
  const numberArrayVal: TypeGuard<number[]> = typed([2, 3, 4]);
  const objectLiteralVal: TypeGuard<{ name: string, age: number }> = typed({ name: "John", age: 30 });
  const emptyObjectVal: TypeGuard<object> = typed({});
  const emptyArrayVal: TypeGuard<any[]> = typed<any[]>([]);
  const anonymousFuncVal: TypeGuard<() => void> = typed(() => { });
  const anonymousFuncParamsVal: TypeGuard<(_: any) => void> = typed((_: any) => { });
  const namedFuncVal: TypeGuard<(a: string, b: number) => void> = typed(function myFunction(a: string, b: number) { });
  const mapVal: TypeGuard<Map<string, string>> = typed(new Map([["key1", "value1"], ["key2", "value2"]]));
  const setVal: TypeGuard<Set<number>> = typed(new Set([1, 2, 3]));
  const dateVal: TypeGuard<Date> = typed(new Date('2021-09-01'));
  const badDateVal: TypeGuard<Date> = typed(new Date('invalid-date'));
  const undefinedArray: TypeGuard<undefined[]> = typed([undefined, undefined]);
  const nullArray: TypeGuard<null[]> = typed([null, null]);

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

  it('should return the value via the value property', () => {
    expect(numberVal.value).toBe(42);
    expect(trueVal.value).toBe(true);
    expect(falseVal.value).toBe(false);
    expect(regexVal.value.toString()).toBe("/test/");
    expect(emptyStringVal.value).toBe("");
    expect(numberArrayVal.value).toEqual([2, 3, 4]);
    expect(objectLiteralVal.value).toEqual({ name: "John", age: 30 });
    expect(emptyObjectVal.value).toEqual({});
    expect(emptyArrayVal.value).toEqual([]);
  });

  it('should return "null" | "undefined" for a null | undefined input', () => {
    expect(nullVal.stringOf()).toBe("null");
    expect(undefinedVal.stringOf()).toBe("undefined");
  });

  it('should return "Function:<anonymous>..." for an anonymous function', () => {
    expect(anonymousFuncVal.stringOf()).toBe("Function:<anonymous>()");
  });

  it('should return "Function:myFunction(a, b)" for a named function with arguments a and b', () => {
    expect(namedFuncVal.stringOf()).toBe("Function:myFunction(a,b)");
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
    expect(emptyStringVal.is("type:String(0)")).toBe(true);
    expect(emptyStringVal.is("")).toBe(true);
    expect(helloStringVal.isTypeString("String(5)")).toBe(true);
    expect(numberVal.is(42)).toBe(true);
    expect(numberVal.is(43)).toBe(false);
    expect(trueVal.is(true)).toBe(true);
    expect(trueVal.is(false)).toBe(false);
    expect(anonymousFuncVal.is(() => { })).toBe(true);
    expect(anonymousFuncParamsVal.is(() => { })).toBe(false);
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

  it("should be able to match primatives using isTypeOf", () => {
    expect(emptyStringVal.isTypeOf("string")).toBe(true);
    expect(emptyStringVal.isTypeOf("string")).toBe(true);
    expect(helloStringVal.isTypeOf("string")).toBe(true);
    expect(numberVal.isTypeOf("number")).toBe(true);
    expect(numberVal.isTypeOf("string")).toBe(false);
    expect(trueVal.isTypeOf("boolean")).toBe(true);
    expect(falseVal.isTypeOf("number")).toBe(false);
    expect(nullVal.isTypeOf("object")).toBe(true);
    expect(anonymousFuncVal.isTypeOf("function")).toBe(true);
    expect(anonymousFuncParamsVal.isTypeOf("function")).toBe(true);
  });

  it("should return a boolean to match lengthed objects", () => {
    expect(helloStringVal.isLength(5)).toBe(true);
    expect(numberArrayVal.isLength(5)).toBe(false);
  });

  it("should be able to check if an item is longer than a length", () => {
    expect(helloStringVal.isLonger(5)).toBe(false);
    expect(helloStringVal.isLonger(4)).toBe(true);
    expect(emptyArrayVal.isLonger(1)).toBe(false);
    expect(numberArrayVal.isLonger(2)).toBe(true);
  });

  it("should be able to check if an item is shorter than a length", () => {
    expect(helloStringVal.isShorter(6)).toBe(true);
    expect(helloStringVal.isShorter(4)).toBe(false);
    expect(emptyArrayVal.isShorter(1)).toBe(true);
    expect(numberArrayVal.isShorter(2)).toBe(false);
  });

  it("should return a boolean to match function properties", () => {
    expect(namedFuncVal.isName("myFunction")).toBe(true);
    expect(namedFuncVal.isTypeString("Function:myFunction(a,b)")).toBe(true);
    expect(anonymousFuncVal.isName("anonymous")).toBe(true);
    expect(anonymousFuncVal.isTypeString("Function:<anonymous>()")).toBe(true);
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

  it("should be able to make a value something else if it isn't defined", () => {
    numberVal.alwaysDefined(10);
    zeroVal.alwaysDefined(10);
    trueVal.alwaysDefined(true);
    falseVal.alwaysDefined(true);
    regexVal.alwaysDefined(/othertest/);
    emptyStringVal.alwaysDefined("Hello");
    numberArrayVal.alwaysDefined([2, 3, 4]);
    objectLiteralVal.alwaysDefined({ name: "Joe", age: 40 });
    emptyObjectVal.alwaysDefined({ undercover: "" });
    emptyArrayVal.alwaysDefined(["A", "B", "C"]);
    undefinedVal.alwaysDefined(true);
    nullVal.alwaysDefined(true);

    // runtime checks
    expect(numberVal.value).toBe(42);
    expect(zeroVal.value).toBe(0);
    expect(trueVal.value).toBe(true);
    expect(falseVal.value).toBe(false);
    expect(regexVal.value).toEqual(/test/);
    expect(emptyStringVal.value).toBe("");
    expect(numberArrayVal.value).toEqual([2, 3, 4]);
    expect(objectLiteralVal.value).toEqual({ name: "John", age: 30 });
    expect(emptyObjectVal.value).toEqual({});
    expect(emptyArrayVal.value).toEqual([]);
    expect(undefinedVal.value).toBe(true);
    expect(nullVal.value).toBe(true);
  });

  it("should be able to make a value something else if it isn't truthy", () => {
    numberVal.alwaysTruthy(10);
    zeroVal.alwaysTruthy(10);
    trueVal.alwaysTruthy(true);
    falseVal.alwaysTruthy(true);
    regexVal.alwaysTruthy(/othertest/);
    emptyStringVal.alwaysTruthy("Hello");
    numberArrayVal.alwaysTruthy([2, 3, 4]);
    objectLiteralVal.alwaysTruthy({ name: "Joe", age: 40 });
    emptyObjectVal.alwaysTruthy({ undercover: "" });
    emptyArrayVal.alwaysTruthy(["A", "B", "C"]);

    // runtime checks
    expect(numberVal.value).toBeTruthy();
    expect(zeroVal.value).toBeTruthy();
    expect(trueVal.value).toBeTruthy();
    expect(falseVal.value).toBeTruthy();
    expect(regexVal.value).toBeTruthy();
    expect(emptyStringVal.value).toBeTruthy();
    expect(numberArrayVal.value).toBeTruthy();
    expect(objectLiteralVal.value).toBeTruthy();
    expect(emptyObjectVal.value).toBeTruthy();
    expect(emptyArrayVal.value).toBeTruthy();
  });

  it("should have a containsValues function for arrays", () => {
    expect(emptyArrayVal.containsValues()).toBe(false);
    expect(numberArrayVal.containsValues()).toBe(true);
    expect(nullArray.containsValues()).toBe(false);
    expect(undefinedArray.containsValues()).toBe(false);
  });

  it("should be able to insert values into arrays", () => {
    emptyArrayVal.alwaysContainsValues([1, 2, 3, "A", "B", "C"]);
    numberArrayVal.alwaysContainsValues([2, 2, 3, 4]);
    nullArray.alwaysContainsValues([null, null, null, null, null]);
    undefinedArray.alwaysContainsValues([undefined, undefined, undefined]);

    expect(emptyArrayVal.value).toStrictEqual([1, 2, 3, "A", "B", "C"]);
    expect(numberArrayVal.value).toStrictEqual([2, 3, 4]);
    expect(nullArray.value).toStrictEqual([null, null]);
    expect(undefinedArray.value).toStrictEqual([undefined, undefined]);
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
    }).toThrow(SyntaxException);
  });
});

describe("Tuple", () => {
  const tuple = Tuple("A", "B", "C");

  it("should create a correct tuple", () => {
    expectTypeOf<typeof tuple>().toEqualTypeOf<[string, string, string]>();
    expectTypeOf<typeof tuple>().not.toBeArray;
    expect(tuple).toEqual(["A", "B", "C"]);
  });

  it("should be able to access the values inside the tuple", () => {
    expect(tuple[0]).toBe("A");
    expect(tuple[1]).toBe("B");
    expect(tuple[2]).toBe("C");
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
  const emptyCollection: Collection<any> = Collection.from([]);
  const noCollection: Collection<any> = Collection.of();

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
    expectTypeOf(numberCollection).toBeNumber;
  });

  it("should b e able to be accessed like an array", () => {
    expect(htmlCollection[0]).toBeInstanceOf(HTMLElement);

    expect(stringCollection[0]).toBeType("string");
    expect(numberCollection[0]).toBeType("number");

    expect(multiCollection[0]).toBeType("string");
    expect(multiCollection[1]).toBeType("boolean");
    expect(multiCollection[2]).toBeType("number");
  });
});

describe("Future", () => {
  it("should just be a promise in disguise", () => {
    expect(Future).toBeInstanceOf(Promise);
  });
});