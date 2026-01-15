import "opti";
import { expectTypeOf } from "expect-type";

describe("Enum", () => {
  it("should create properties", () => {
    const myEnum = Enum("A", "B", "C");

    expect(typeof myEnum.A).toBe("symbol");
    expect(typeof myEnum.B).toBe("symbol");
    expect(typeof myEnum.C).toBe("symbol");
  });

  it("should make properties that are unique and not comparable", () => {
    const myEnum = Enum("A", "B", "C", "D");

    expect(myEnum.A === myEnum.B).toBeFalsy();
    expect(myEnum.C === myEnum.D).toBeFalsy();
    expect(myEnum.A === myEnum.C).toBeFalsy();
    expect(myEnum.B === myEnum.D).toBeFalsy();
    expect(myEnum.A === myEnum.A).toBeTruthy();
    expect(myEnum.B === myEnum.B).toBeTruthy();
    expect(myEnum.C === myEnum.C).toBeTruthy();
    expect(myEnum.D === myEnum.D).toBeTruthy();
    
    try {
      Enum("A", "A", "B", "Q", "Q");
      fail("Enum did not throw for duplicate properties");
    } catch (e: any) {
      expect(e).toBeInstanceOf(SyntaxException);
      expect(e.getMessage()).toBe("Enum members may only be unique");
    }
  });

  it("should throw when the wrong characters are added", () => {
    try {
      Enum("A_", "$B", "{}");
      fail("Enum did not throw for invalid characters");
    } catch (e: any) {
      expect(e).toBeInstanceOf(SyntaxException);
      expect(e.getMessage()).toBe("Enum values must be defined and may only be the characters A-Z, a-z, 0-9, _ and $");
    }
  });

  it("should be iterable", () => {
    expect([...Enum("A", "B", "C", "D")]).toEqual(["A", "B", "C", "D"]);

    const iterator = Enum("A", "B", "C", "D")[Symbol.iterator]();
    expect(iterator.next()).toEqual({ value: "A", done: false });
    expect(iterator.next()).toEqual({ value: "B", done: false });
    expect(iterator.next()).toEqual({ value: "C", done: false });
    expect(iterator.next()).toEqual({ value: "D", done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: true });
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

  const collections = [
    htmlCollection,
    stringCollection, 
    numberCollection,
    multiCollection,
    emptyCollection,
    noCollection
  ];

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

  it("should be able to be accessed like an array", () => {
    expect(htmlCollection[0]).toBeInstanceOf(HTMLElement);

    expect(typeof stringCollection[0]).toBe("string");
    expect(typeof numberCollection[0]).toBe("number");
    expect(typeof multiCollection[0]).toBe("string");
    expect(typeof multiCollection[1]).toBe("boolean");
    expect(typeof multiCollection[2]).toBe("number");

    expect(typeof stringCollection.item(0)).toBe("string");
    expect(typeof numberCollection.item(0)).toBe("number");
    expect(typeof multiCollection.item(0)).toBe("string");
    expect(typeof multiCollection.item(1)).toBe("boolean");
    expect(typeof multiCollection.item(2)).toBe("number");
  });

  it.each(collections)("$name should be iterable", (collection) => {
    collection.each((v, i) => {
      expect(v).toBe(collection[i]);
    });

    for (const [index, value] of collection.entries()) {
      expect(collection[index]).toBe(value);
    }

    // for (const index of collection.keys()) {
    //   expect(collection[index]).toBe(value);
    // }

    // for (const value of collection.values()) {

    // }
  });

  it.each(collections)("should be convertible to arrays", (collection) => {
    expect(collection.toArray()).toBeInstanceOf(Array);
    expect(collection.toReadonlyArray()).toBeInstanceOf(Array);
  });
});

describe("Future", () => {
  it("should just be a promise in disguise", () => {
    expect(new Future(() => {})).toBeInstanceOf(Promise);
  });
});