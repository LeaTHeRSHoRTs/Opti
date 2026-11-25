import 'opti';

const Errors: { name: string, instance: ErrorConstructorOf }[] = [
    { name: "CloneError",          instance: CloneError }, 
    { name: "AssertionError",      instance: AssertionError }, 
    { name: "NotImplementedError", instance: NotImplementedError }, 
    { name: "AccessError",         instance: AccessError }, 
    { name: "UnknownError",        instance: UnknownError }, 
    { name: "DebouncedError",      instance: DebouncedError }
];

describe.each(Errors)("$name", ({ name, instance }) => {
    const normalInstance = new instance();
    const instanceWithMessage = new instance("myMessage");
    const instanceWithCause = new instance(undefined, { cause: "throwing" });
    const instanceWithAll = new instance("myMessage", { cause: "throwing" });

    it("should be a subclass of Error", () => {
        expect(normalInstance).toBeInstanceOf(Error);
    });

    it("should have the right name", () => {
        expect(normalInstance.name).toBe(name);
    });

    it("should have the right message", () => {
        expect(normalInstance.message).toBe("");
        expect(instanceWithMessage.message).toBe("myMessage");
    });

    it("should be have the right cause", () => {
        expect(instanceWithCause.cause).toBe("throwing");
    });

    it("should be have the right message and cause", () => {
        expect(instanceWithAll.message).toBe("myMessage");
        expect(instanceWithAll.cause).toBe("throwing");
    });

    it("should give the right stack trace", () => {
        const error = new instance("Test error");
        
        expect(error.stack).toBeDefined();
        expect(error.stack).toContain(instance.name);
    });
});

describe("RuntimeError", () => {
    const normalInstance = new RuntimeError();
    const instanceWithMessage = new RuntimeError("myMessage");
    const instanceWithCause = new RuntimeError(undefined, "throwing");
    const instanceWithAll = new RuntimeError("myMessage", "throwing");

    it("should not be a subclass of Error", () => {
        expect(normalInstance).not.toBeInstanceOf(Error);
    });

    it("should have the right name", () => {
        expect(normalInstance.name).toBe("RuntimeError");
        expect(normalInstance.toString()).toBe("RuntimeError");
    });

    it("should have the right message", () => {
        expect(normalInstance.message).toBe("");
        expect(instanceWithMessage.message).toBe("myMessage");
        expect(instanceWithMessage.toString()).toBe("RuntimeError: myMessage");
    });

    it("should be have the right cause", () => {
        expect(instanceWithCause.cause).toBe("throwing");
    });

    it("should be have the right message and cause", () => {
        expect(instanceWithAll.message).toBe("myMessage");
        expect(instanceWithAll.cause).toBe("throwing");
    });

    it("should give the right stack trace", () => {
        expect(normalInstance.stack).toBeDefined();
        expect(normalInstance.stack).toContain(normalInstance.name);
    });

    it("should not be catch-able using the Error class or Error class", () => {
        let caught: unknown;

        try {
            throw new RuntimeError();
        } catch (e) {
            caught = e;
        }

        expect(caught).toBeInstanceOf(RuntimeError);
        expect(caught).not.toBeInstanceOf(Error);
    });
});