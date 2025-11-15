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

describe("EventTarget.events", () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement("div");
    // Reset per-instance _events before each test
    (element as any)._events = {};
  });

  it("should be defined", () => {
    expect(element.events).toBeDefined();
  });

  it("should contain a list of events and the function accompanying them", () => {
    element.addEventListener("click", () => console.log("first click event"));
    element.addEventListener("click", () => console.log("second click event"));
    element.addEventListener("blur", () => console.log("blur event"));
    element.addEventListener("focus", () => console.log("focus event"));

    expect(element.events.click).toHaveLength(2);
    expect(element.events.blur).toHaveLength(1);
    expect(element.events.focus).toHaveLength(1);

    expect(element.events.click?.[0]).toBeInstanceOf(Function);
    expect(element.events.click?.[1]).toBeInstanceOf(Function);
    expect(element.events.blur?.[0]).toBeInstanceOf(Function);
    expect(element.events.focus?.[0]).toBeInstanceOf(Function);
  });
});