// @vitest-environment node

describe("Opti module", () => {
    it("should crash if the window object is not defined", async () => {
        vi.resetModules();

        await expect(import("opti")).rejects.toThrow("Opti requires a browser environment.");
    });

    it("should crash if the document object is not defined", async () => {
        Object.defineProperty(globalThis, "window", {
            value: {},
            configurable: true,
            writable: true
        });

        vi.resetModules();

        await expect(import("opti")).rejects.toThrow("Opti requires a browser environment.");

        delete (globalThis as { window?: Window }).window;

        vi.resetModules();
    });
});