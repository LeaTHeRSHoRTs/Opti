import "opti";

describe("Exception", () => {
  it("should throw", () => {
    expect(() => {
      throw new Exception("ErrorException");
    }).toThrow();
  });

  const exceptions: { name: string, instance: ExceptionConstructor }[] = [{
    name: "Exception",
    instance: Exception
  }, {
    name: "SyntaxException",
    instance: SyntaxException
  }, {
    name: "TypeException",
    instance: TypeException
  }, {
    name: "CloneException",
    instance: CloneException
  }, {
    name: "NumberTooSmallException",
    instance: NumberTooSmallException
  }, {
    name: "AssertionException",
    instance: AssertionException
  }, {
    name: "NotImplementedException",
    instance: NotImplementedException
  }, {
    name: "AccessException",
    instance: AccessException
  }, {
    name: "UnknownException",
    instance: UnknownException
  }, {
    name: "DebouncedException",
    instance: DebouncedException
  }, {
    name: "AbstractMethodInvokedException",
    instance: AbstractMethodInvokedException
  }, {
    name: "AbstractInitializationException",
    instance: AbstractInitializationException
  }];

  describe.each(exceptions)("$name", ({ name, instance }) => {
    const normalInstance = new instance;
    const instanceWithMessage = new instance("myMessage");
    const instanceWithCause = new instance(undefined, "throwing");
    const instanceWithAll = new instance("myMessage", "throwing");

    it("should be a subclass of Exception", () => {
      expect(normalInstance).toBeInstanceOf(Exception);
    });

    it("should have the right name", () => {
      expect(normalInstance.name).toBe(name);
    });

    it("should have the right message", () => {
      expect(normalInstance.getMessage()).toBe("");
      expect(instanceWithMessage.getMessage()).toBe("myMessage");
    });

    it("should be have the right cause", () => {
      expect(instanceWithCause.getCause()).toBe("throwing");
    });

    it("should be have the right message and cause", () => {
      expect(instanceWithAll.getMessage()).toBe("myMessage");
      expect(instanceWithAll.getCause()).toBe("throwing");
    });

    it("should be throwable again using the throw method", () => {
      expect(() => {
        normalInstance.throw();
      }).toThrow(instance);
    });

    it("should give the right stack trace", () => {
      Error.prototype.stack = "MOCK_STACK";

      try {
        throw new instance;
      } catch(e) {
        if (e instanceof instance) {
          expect(e.getStackTrace()).toBe("MOCK_STACK");
        }
      }
    });
  });
});

describe("RuntimeException", () => {
  const runtime = new RuntimeException();

  it("should do the same thing as exceptions", () => {
    expect(runtime.name).toBe("RuntimeException");
    expect(runtime.getMessage()).toBe("");
  });

  it("should not be catch-able using the exception class or Error class", () => {
    try {
      throw new RuntimeException();
    } catch (e) {
      if (e instanceof Error || e instanceof Exception) {
        fail();
      } else if (!(e instanceof RuntimeException)) {
        fail();
      }
    }
  });
});