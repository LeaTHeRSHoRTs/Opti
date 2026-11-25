// @vitest-environment node

const opti = "../src/index.ts";
console.log("window:", typeof window);
console.log("document:", typeof document);

describe.skip("Opti module", () => {
    beforeAll(() => {
        vi.stubGlobal("window", undefined);
        vi.stubGlobal("document", undefined);
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    })

    it("should crash if the window object is not defined", async () => {
        vi.resetModules();

        await expect(import(opti)).rejects.toThrow("Opti requires a browser environment.");
    });

    it("should crash if the document object is not defined", async () => {
        Object.defineProperty(globalThis, "window", {
            value: {},
            configurable: true,
            writable: true
        });

        vi.resetModules();

        await expect(import(opti)).rejects.toThrow("Opti requires a browser environment.");

        delete (globalThis as { window?: Window }).window;

        vi.resetModules();
    });
});