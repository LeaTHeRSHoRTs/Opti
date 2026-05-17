describe("Opti module", () => {
  it("should crash if the window object is not defined ", async () => {
    vi.stubGlobal('window', undefined);

    try {
      vi.resetModules();
      await expect(import("opti")).rejects.toThrow("Opti requires a browser environment.");
    } finally {
      vi.unstubAllGlobals();
      vi.resetModules();
    }

    await expect(import('opti')).resolves.toEqual(expect.anything());
  });

  it("should crash if the document object is not defined ", async () => {
    vi.stubGlobal('document', undefined);

    try {
      vi.resetModules();
      await expect(import("opti")).rejects.toThrow("Opti requires a browser environment.");
    } finally {
      vi.unstubAllGlobals();
      vi.resetModules();
    }

    await expect(import('opti')).resolves.toEqual(expect.anything());
  });
});