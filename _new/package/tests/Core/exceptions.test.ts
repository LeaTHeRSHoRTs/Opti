import "opti";

describe("Exception", () => {
  it("should throw", () => {
    expect(() => {
      throw new Exception("ErrorException");
    }).toThrow();
  });

  it("should have a static method that can check if an object is an exception", () => {
    expect(Exception.isException(new Exception)).toBeTruthy();
    expect(Exception.isException(new Error)).toBeFalsy();
    expect(Exception.isException(new SyntaxException)).toBeTruthy();
    expect(Exception.isException(new SyntaxError)).toBeFalsy();
    expect(Exception.isException(new AssertionException)).toBeTruthy();
    expect(Exception.isException(new TypeError)).toBeFalsy();
    expect(Exception.isException(new class extends Exception { })).toBeTruthy();
  });

  it("should have a static method that can check if an object is an exception or runtime exception", () => {
    expect(Exception.isAnyException(new Exception)).toBeTruthy();
    expect(Exception.isAnyException(new Error)).toBeFalsy();
    expect(Exception.isAnyException(new SyntaxException)).toBeTruthy();
    expect(Exception.isAnyException(new SyntaxError)).toBeFalsy();
    expect(Exception.isAnyException(new AssertionException)).toBeTruthy();
    expect(Exception.isAnyException(new TypeError)).toBeFalsy();
    expect(Exception.isAnyException(new RuntimeException)).toBeTruthy();
    expect(Exception.isAnyException(new class extends RuntimeException { })).toBeTruthy();
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
      expect(normalInstance.getName()).toBe(name);
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
      } catch (e) {
        if (e instanceof instance) {
          expect(e.getStackTrace()).toBe("MOCK_STACK");
        }
      }
    });
  });
});

describe("RuntimeException", () => {
  const normalInstance = new RuntimeException;
  const instanceWithMessage = new RuntimeException("myMessage");
  const instanceWithCause = new RuntimeException(undefined, "throwing");
  const instanceWithAll = new RuntimeException("myMessage", "throwing");

  it("should not be a subclass of Exception", () => {
    expect(normalInstance).not.toBeInstanceOf(Exception);
  });

  it("should have the right name", () => {
    expect(normalInstance.name).toBe("RuntimeException");
    expect(normalInstance.getName()).toBe("RuntimeException");
    expect(normalInstance.toString()).toBe("RuntimeException");
  });

  it("should have the right message", () => {
    expect(normalInstance.getMessage()).toBe("");
    expect(instanceWithMessage.getMessage()).toBe("myMessage");
    expect(instanceWithMessage.toString()).toBe("RuntimeException: myMessage");
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
    }).toThrow(RuntimeException);
  });

  it.skip("should give the right stack trace", () => {
    Error.prototype.stack = "MOCK_STACK";

    try {
      throw new RuntimeException;
    } catch (e) {
      if (e instanceof RuntimeException) {
        (e as any).stack = "MOCK_STACK";
        expect(e.getStackTrace()).toBe("MOCK_STACK");
      } else {
        expect.fail("Error was not a RuntimeException");
      }
    }

    expect.fail("RuntimeException was not caught");
  });

  it("should not be catch-able using the exception class or Error class", () => {
    try {
      throw new RuntimeException();
    } catch (e) {
      if (e instanceof Error || e instanceof Exception) {
        expect.fail("Error was not instance of Error or Exception");
      } else if (!(e instanceof RuntimeException)) {
        expect.fail("Error was not a runtime exception");
      }
    }
  });
});