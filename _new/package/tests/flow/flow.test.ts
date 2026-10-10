import { Flow } from 'opti';

declare global {
    var FLAG_1: boolean;
    var FLAG_2: boolean | undefined;
    var nonExistentProp: string | undefined;

    interface Document {
        nonWorkingFunction(): void;
    }
}

describe("Opti.flow", () => {
    it("should be true", () => {
        expect(Opti.flow).toBe(true);
    });
});

describe("Flow.flows", () => {
    it("should be able to check if an implementation works", () => {
        expect(Flow.flows(document.createElement)).toBeTruthy();
        expect(Flow.flows(document.nonWorkingFunction)).toBeFalsy();
    });
});

describe("Flow.always", () => {
    it("should be able to check if an implementation works", () => {
        expect(Flow.always(document.createElement, vi.fn())).toContain(false);
        expect(Flow.always(document.nonWorkingFunction, vi.fn())).toContain(true);
    });

    it("should be able to replace with the supplied value if the original value was unusable", () => {
        const mock1 = vi.fn();
        const mock2 = vi.fn();

        const [result1, replaced1] = Flow.always(document.createElement, mock1);
        const [result2, replaced2] = Flow.always(document.nonWorkingFunction, mock2);

        expect(replaced1).toBeFalsy();
        expect(replaced2).toBeTruthy();
        expect(result1).not.toBe(mock1);
        expect(result2).toBe(mock2);
    });
});