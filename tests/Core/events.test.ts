import "../../src/opti";

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

  const clickFn1 = () => console.log("first click event");
  const clickFn2 = () => console.log("second click event");
  const blurFn = () => console.log("blur event");
  const focusFn = () => console.log("focus event");

  beforeEach(() => {
    element = document.createElement("div");
    (element as any)._events = {};

    element.addEventListener("click", clickFn1);
    element.addEventListener("click", clickFn2);
    element.addEventListener("blur", blurFn);
    element.addEventListener("focus", focusFn);
  });

  afterEach(() => {
    element.removeEventListener("click", clickFn1);
    element.removeEventListener("click", clickFn2);
    element.removeEventListener("blur", blurFn);
    element.removeEventListener("focus", focusFn);
  });

  it("should be defined", () => {
    expect(element.getEvents).toBeDefined();
  });

  it("should contain a list of events with the right lengths", () => {
    expect(element.getEvents("click")).toHaveLength(2);
    expect(element.getEvents("blur")).toHaveLength(1);
    expect(element.getEvents("focus")).toHaveLength(1);
    expect(element.getEvents("dblclick")).toHaveLength(0);
  });
});