import { Unsync } from 'opti';

describe("Unsync.Exception", () => {
    it("should throw");

    const exceptions: { name: string, instance: DynErrorCtor }[] = [{
        name: "InvalidRegistrationException",
        instance: Unsync.InvalidRegistrationException
    }];

    describe.each(exceptions)("$name", ({ name, instance }) => {
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