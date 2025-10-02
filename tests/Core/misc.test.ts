describe("Date.at", () => {
  it("should return a number that is the same as the milliseconds since `DateOrigin`", () => {
    const dayAt = Date.at(1972, 8, 19, 7, 6, 27, 0);
    const dayAtOrigin = new Date(1972, 8, 19, 7, 6, 27, 0).getTime();

    expect(dayAt).toBe(dayAtOrigin);
  });
});

describe("Date.fromTime", () => {
  it("should convert a `Time` object to a `Date` object", () => {
    const time = new Time(2, 19, 43, 42);

    expect(Date.fromTime(time, 2025, 6, 4)).toBeInstanceOf(Date);
  });
});

describe("Math.random", () => {
  it("should return a random number from 5 to 10", () => {
    for (let i = 0; i < 100; i++) {
      const result = Math.random(5, 15);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThanOrEqual(15);
    }
  });

  it("should return a random number from 0 to 10", () => {
    for (let i = 0; i < 100; i++) {
      const result = Math.random(15);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(15);
    }
  });
});

describe("Number.prototype.repeat", () => {
  it("should iterate the amount of thimes as the number", () => {
    const times = 5;
    let i = 0;

    times.repeat(() => {
      i++;
    });

    expect(i).toBe(5);
  });
});

describe("Array.prototype.unique", () => {
  it("should filter out the non-unique values", () => {
    const arr = [1, 2, 2, 3];
    const uniqueArr = arr.unique();

    expect(uniqueArr).toStrictEqual([1, 2, 3]);
  });
});

describe("Array.prototype.chunk", () => {
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

describe("Object.clone", () => {
  it("should make a clone of primative objects", () => {
    expect(Object.clone(42)).toBe(42);
    expect(Object.clone('hello')).toBe('hello');
    expect(Object.clone(null)).toBe(null);
    expect(Object.clone(undefined)).toBe(undefined);
  });

  it('clones plain objects deeply', () => {
    const original = { a: 1, b: { c: 2 } };
    const copied = Object.clone(original);

    expect(copied).toEqual(original);
    expect(copied).not.toBe(original);
  });

  it('clones arrays deeply', () => {
    const arr = [1, 2, [3, 4]];
    const copied = Object.clone(arr);

    expect(copied).toEqual(arr);
    expect(copied).not.toBe(arr);
  });

  it('preserves prototype chain', () => {
    class Custom {
      x = 123;
      method() {
        return this.x;
      }
    }

    const instance = new Custom();
    const copied = Object.clone(instance);

    expect(copied).not.toBe(instance);
    expect(copied).toBeInstanceOf(Custom);
    expect(copied.method()).toBe(123);
  });
  
  it("should throw when it tries to clone symbols", () => {
    expect(() => Object.clone(Symbol("Hello"))).toThrow();
  });

  it("should be able to make shallow copies", () => {
    const obj = new class Example { run() {} };
    const arr = [3, 2, 1];

    expect(Object.clone(obj)).toEqual(obj);
    expect(Object.clone(arr)).toEqual(arr);
  });
});

describe("Object.forEach", () => {
  it("should iterate over a primative object's values", () => {
    const obj = {
      a: 12,
      b: "forty-two",
      c: false
    };

    let
      ai = false,
      bi = false,
      ci = false;

    Object.forEach(obj, (key) => {
      switch (key) {
        case "a": ai = true;
        case "b": bi = true;
        case "c": ci = true;
      }
    });

    expect(ai).toBeTruthy();
    expect(bi).toBeTruthy();
    expect(ci).toBeTruthy();
  });
});

describe("String.prototype.capitalize", () => {
  it("should capitalize the first letter in the string", () => {
    expect("helloworld".capitalize()).toBe("Helloworld");
  });
});

describe("String.prototype.remove", () => {
  it("should remove a substring by a regular expression or a string", () => {
    expect("Hello_ World_".remove("_")).toBe("Hello World_");
    expect("Hello_ World_".remove(/_/)).toBe("Hello World_");
  });
});

describe("String.prototype.removeAll", () => {
  it("should remove all instances of the searcher regular expression or string", () => {
    expect("Hello_ World_".removeAll("_")).toBe("Hello World");
    expect("Hello_ World_".removeAll(/_/)).toBe("Hello World");
  });
});