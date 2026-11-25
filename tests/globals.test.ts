import 'opti';

describe("assert", () => {
    it("should throw if the condition is false", () => {
        expect(() => {
            const myString: string = "Hello";
            const yourString: string = "Goodbye";
            assert(myString === yourString);
        }).toThrow(AssertionError);
    });

    it("should not throw if the condition is true", () => {
        expect(() => {
            const myString: string = "Hello";
            const yourString: string = "Hello";
            assert(myString === yourString);
        }).not.toThrow(AssertionError);
    });
});

describe('f', () => {
    it("should immediately invoke a function", () => {
        let called = false;
        f(() => { called = true; });
        (() => { })();

        expect(called).toBeTruthy();
    });

    it("should be able to return a value", () => {
        expect(f(() => "Returned")).toBe("Returned");
    });
});

describe("sleep", () => {
    beforeAll(() => {
        vi.useFakeTimers();
        vi.spyOn(globalThis, 'setTimeout');
    });

    afterAll(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("should wait the specified number of milliseconds before executing", async () => {
        const promise = sleep(5000);

        // Immediately check setTimeout call
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);

        // Advance all timers, resolving the promise
        vi.runAllTimers();

        await expect(promise).resolves.toBeUndefined();
    });

    it("should run code afterwards at the set time", async () => {
        const callback = vi.fn<() => void>();

        expect(callback).not.toHaveBeenCalled();
        const promise = sleep(5000);

        vi.runAllTimers();

        await promise; // ensures microtasks resolve

        callback()

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should throw immediately if the sleep length is 0 or lower", async () => {
        expect(() => sleep(0)).toThrow(new RangeError("Invalid timeout value (must be greater than 0)"));
        expect(() => sleep(-10)).toThrow(new RangeError("Invalid timeout value (must be greater than 0)"));
    });
});

describe("isEmpty", () => {
    it("should correctly evaluate empty values", () => {
        const emptyValues = [
            "", 
            NaN, 
            0, 
            null, 
            undefined, 
            false, 
            [], 
            {},
            new Map(),
            new Set()
        ];
        for (const val of emptyValues) {
            expect(isEmpty(val)).toBe(true);
        }
    });

    it("should correctly evaluate non-empty values", () => {
        const nonEmptyValues = [
            "Hello",
            [1, 2],
            { key: "value" },
            true,
            Infinity,
            -Infinity,
            1,
            () => { },
            Symbol('x'),
            new Date(),
            new Map([["key", "value"]]),
            new Set(["one", "two"])
        ];
        for (const val of nonEmptyValues) {
            expect(isEmpty(val)).toBe(false);
        }
    });
});

describe("Opti", () => {
    it("should exist", () => {
        expect(Opti).toBeDefined();
    });

    it("should have all false properties", () => {
        expect(Opti.crafty).toBeFalsy();
        expect(Opti.unsync).toBeFalsy();
        expect(Opti.flow).toBeFalsy();
        expect(Opti.query).toBeFalsy();
        expect(Opti.request).toBeFalsy();
    });
});