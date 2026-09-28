import 'opti';
import 'opti/unsync';

describe("Unsync.Exception", () => {
  it("should throw");

  const exceptions: { name: string, instance: ExceptionConstructor }[] = [{
    name: "InvalidRegistrationException",
    instance: Unsync.InvalidRegistrationException
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