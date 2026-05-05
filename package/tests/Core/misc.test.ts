import "opti";

describe("Date.at", () => {
  it("should return a number that is the same as the milliseconds since `DateOrigin`", () => {
    const dayAt = Date.at(1972, 8, 19, 7, 6, 27, 0);
    const dayAtOrigin = new Date(1972, 8, 19, 7, 6, 27, 0).getTime();

    expect(dayAt).toBe(dayAtOrigin);
  });
});

describe("Math.randomRange", () => {
  it("should return a random number from 5 to 10", () => {
    for (let i = 0; i < 100; i++) {
      const result = Math.randomRange(5, 15);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThanOrEqual(15);
    }
  });

  it("should return a random number from 0 to 10", () => {
    for (let i = 0; i < 100; i++) {
      const result = Math.randomRange(15);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(15);
    }
  });
});

describe("Number.repeat", () => {
  it("should iterate the amount of thimes as the number", () => {
    let i = 0;

    (5).repeat(() => {
      i++;
    });

    expect(i).toBe(5);
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

    Object.forEach(obj, (key, value) => {
      if (key === "a" && typeof value === "number") ai = true;
      if (key === "b" && typeof value === "string") bi = true;
      if (key === "c" && typeof value === "boolean") ci = true;
    });

    expect(ai).toBeTruthy();
    expect(bi).toBeTruthy();
    expect(ci).toBeTruthy();
  });
});

describe("String.capitalize", () => {
  it("should capitalize the first letter in the string", () => {
    expect("helloworld".capitalize()).toBe("Helloworld");
  });
});

describe("String.remove", () => {
  it("should remove a substring by a regular expression", () => {
    expect("Hello_ World_".remove(/_/)).toBe("Hello World_");
    expect("Hello_ World _@Advanced".remove(/_@/)).toBe("Hello_ World Advanced");
    expect("(hello) (Hello) World".remove(/\(h\w+\)\s/)).toBe("(Hello) World");
  });

  it("should support the global regex flag to remove more than one occurrence", () => {
    expect("Hello_ World_".remove(/_/g)).toBe("Hello World");
    expect("Hello_@_ World_@ _@Advanced".remove(/_@_?/g)).toBe("Hello World Advanced");
    expect("(hello)(hello)(Hello) World".remove(/\(h\w+\)/g)).toBe("(Hello) World");
  });

  it("should remove a substring by a string", () => {
    expect("Hello_ World_".remove("_")).toBe("Hello World_");
    expect("Hello_  W World_".remove("_  W")).toBe("Hello World_");
  });
});

describe("String.toCase", () => {
  const sample = "hello world example";

  it("should convert to kebab-case", () => {
    expect(sample.toCase("kebab")).toBe("hello-world-example");
  });

  it("should convert to snake_case", () => {
    expect(sample.toCase("snake")).toBe("hello_world_example");
  });

  it("should convert to dot.case", () => {
    expect(sample.toCase("dot")).toBe("hello.world.example");
  });

  it("should convert to camelCase", () => {
    expect(sample.toCase("camel")).toBe("helloWorldExample");
  });

  it("should convert to PascalCase", () => {
    expect(sample.toCase("pascal")).toBe("HelloWorldExample");
  });

  it("should convert to Train-Case", () => {
    expect(sample.toCase("train")).toBe("HelloWorldExample");
  });

  it("should handle a single word without spaces", () => {
    expect("word".toCase("kebab")).toBe("word");
    expect("word".toCase("camel")).toBe("word");
  });

  it("should handle multiple consecutive spaces", () => {
    const spaced = "a  b   c";
    expect(spaced.toCase("kebab")).toBe("a-b-c");
    expect(spaced.toCase("snake")).toBe("a_b_c");
    expect(spaced.toCase("dot")).toBe("a.b.c");
    expect(spaced.toCase("camel")).toBe("aBC");
  });
});

describe("String.matches", () => {
  it("should be able to match a value in a string", () => {
    expect("word".matches("word")).toBeTruthy();
    expect("word".matches(/word/)).toBeTruthy();
    expect("word".matches(/\w+/)).toBeTruthy();
  });

  it("should not match wrong values in a string", () => {
    expect("word".matches("notWord")).toBeFalsy();
    expect("word".matches(/\d+\w+/)).toBeFalsy();
    expect("word".matches(/\d\d\w{2,}/)).toBeFalsy();
  });
});

describe("Function.memo", () => {
  it("should call the original function again if arguments change", () => {
    let callTimes = 0;
    const func = (a: number, b: number) => a + b + callTimes++;

    const newFn = vi.fn(Function.memo(func));
    newFn(2, 3);

    expect(newFn(4, 5)).toBe(10);

    expect(newFn).toHaveBeenCalledTimes(2);
    expect(newFn(4, 5)).toBe(10);
    expect(newFn(2, 3)).toBe(5);
  });
});

describe("Function.throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should stall if the time hasn't elapsed", () => {
    const fn = vi.fn();
    const throttled = Function.throttle(fn, 1000);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("Function.debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should execute the function after the delay", () => {
    const fn = vi.fn();
    const debounced = Function.debounce(fn, 1000);

    void debounced(); // call once

    expect(fn).not.toHaveBeenCalled(); // not immediately

    vi.advanceTimersByTime(1000); // move time forward
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // it("should only execute once after multiple rapid calls", () => {
  //   const fn = vi.fn();
  //   const debounced = Function.debounce(fn, 1000);

  //   const p1 = debounced(); // should resolve
  //   const p2 = debounced(); // should reject
  //   const p3 = debounced(); // should reject

  //     // Fast-forward time to trigger the actual execution
  //   vi.advanceTimersByTime(1000);

  //   //expect(p1).resolves.toBeUndefined();
  //   expect(p2).rejects.toBeInstanceOf(DebouncedException);
  //   expect(p3).rejects.toBeInstanceOf(DebouncedException);

  //   expect(fn).toHaveBeenCalledTimes(3);
  // }, 10_000);

  it("should allow new calls after previous delay", () => {
    const fn = vi.fn();
    const debounced = Function.debounce(fn, 1000);

    void debounced();
    vi.advanceTimersByTime(1000); // first execution

    void debounced();
    vi.advanceTimersByTime(1000); // second execution

    expect(fn).toHaveBeenCalledTimes(2);
  });
});