const opti = "../src/index.ts";

describe("Opti module", () => {
    it("should crash if the window object is not defined", async () => {
        await expect(import(opti))
            .rejects
            .toThrow("Opti requires a browser environment.");
    });

    it("should crash if the document object is not defined", async () => {
        await expect(import(opti))
            .rejects
            .toThrow("Opti requires a browser environment.");
    });
});