import 'opti';

describe("Errors", () => {
    const Errors: { name: string, instance: DynErrorCtor }[] = [{
        name: "CloneError",
        instance: CloneError
    }, {
        name: "NumberTooSmallError",
        instance: NumberTooSmallError
    }, {
        name: "AssertionError",
        instance: AssertionError
    }, {
        name: "NotImplementedError",
        instance: NotImplementedError
    }, {
        name: "AccessError",
        instance: AccessError
    }, {
        name: "UnknownError",
        instance: UnknownError
    }, {
        name: "DebouncedError",
        instance: DebouncedError
    }];

    describe.each(Errors)("$name", ({ name, instance }) => {
        const normalInstance = new instance;
        const instanceWithMessage = new instance("myMessage");
        const instanceWithCause = new instance(undefined, "throwing");
        const instanceWithAll = new instance("myMessage", "throwing");

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
            Error.prototype.stack = "MOCK_STACK";

            try {
                throw new instance;
            } catch (e) {
                if (e instanceof instance) {
                    expect(e.stack).toBe("MOCK_STACK");
                }
            }
        });
    });
});

describe("RuntimeError", () => {
    const normalInstance = new RuntimeError;
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

    it.skip("should give the right stack trace", () => {
        Error.prototype.stack = "MOCK_STACK";

        try {
            throw new RuntimeError;
        } catch (e) {
            if (e instanceof RuntimeError) {
                e.stack = "MOCK_STACK";
                expect(e.stack).toBe("MOCK_STACK");
            } else {
                expect.fail("Error was not a RuntimeError");
            }
        }

        expect.fail("RuntimeError was not caught");
    });

    it("should not be catch-able using the Error class or Error class", () => {
        try {
            throw new RuntimeError();
        } catch (e) {
            if (e instanceof Error || e instanceof Error) {
                expect.fail("Error was not instance of Error or Error");
            } else if (!(e instanceof RuntimeError)) {
                expect.fail("Error was not a runtime Error");
            }
        }
    });
});