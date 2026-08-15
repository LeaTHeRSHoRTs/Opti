describe("Flow module", () => {
  it("should crash if opti is not included and not crash if it is included", async () => {
    vi.stubGlobal('document', undefined);

    try {
      vi.resetModules();
      //@ts-expect-error
      await expect(import("opti/flow")).rejects.toThrow();
    } finally {
      vi.unstubAllGlobals();
      vi.resetModules();
    }

    //@ts-expect-error
    await import('opti');
    //@ts-expect-error
    await expect(import('opti/flow')).resolves.toEqual(expect.anything());
  });
});