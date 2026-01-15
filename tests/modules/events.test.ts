import "opti";

describe("EventTarget.addEventListener", () => {
  it("should still normally work", () => {
    const element = document.createElement("div");
    const triggers = {
      loaded: false,
      clicked: false
    };

    document.addEventListener("click", e => {
      expect(e).toBeInstanceOf(MouseEvent);
      triggers.loaded = true;
    });

    element.addEventListener("click", e => {
      expect(e).toBeInstanceOf(MouseEvent);
      triggers.clicked = true;
    });

    element.dispatchEvent(new MouseEvent("click"));
    document.dispatchEvent(new MouseEvent("click"));

    expect(triggers.loaded).toBeTruthy();
    expect(triggers.clicked).toBeTruthy();
  });
});