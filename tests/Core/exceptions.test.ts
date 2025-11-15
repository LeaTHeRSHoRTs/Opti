function fail() {
  expect(false).toBe(true);
}

function succeed() {
  expect(true).toBe(true);
}

describe("Exception", () => {
  it("should not be instantisable", () => {
    expect(() => {
      new Exception("ErrorException");
    }).toThrow();
  });

  it.each([{
    name: "SyntaxException",
    instance: new SyntaxException
  }, {
    name: "TypeException",
    instance: new TypeException
  }, {
    name: "CloneException",
    instance: new CloneException
  }, {
    name: "NumberTooSmallException",
    instance: new NumberTooSmallException
  }, {
    name: "AssertionException",
    instance: new AssertionException
  }, {
    name: "NotImplementedException",
    instance: new NotImplementedException
  }, {
    name: "AccessException",
    instance: new AccessException
  }, {
    name: "UnknownException",
    instance: new UnknownException
  }, {
    name: "DebouncedException",
    instance: new DebouncedException
  }, {
    name: "AbstractMethodInvokedException",
    instance: new AbstractMethodInvokedException
  }, {
    name: "AbstractInitializationException",
    instance: new AbstractInitializationException
  }])("$name: should perform the same behavior", ({ name, instance }) => {
    expect(instance).toBeInstanceOf(Exception);
    expect(instance.name).toBe(name);
    expect(instance.getMessage()).toBe("");
  });
});

describe("RuntimeException", () => {
  const runtime = new RuntimeException();

  it("should do the same thing as exceptions", () => {
    expect(runtime.name).toBe("RuntimeException");
    expect(runtime.getMessage()).toBe("");
  });

  it("should not be catchable using the exception class or Error class", () => {
    try {
      throw new RuntimeException();
    } catch (e) {
      if (e instanceof Error) {
        fail();
      } else if (e instanceof Exception) {
        fail();
      } else if (e instanceof RuntimeException) {
        succeed();
      }
    }
  });
});