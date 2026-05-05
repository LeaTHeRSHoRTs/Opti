import "opti";
import "opti/query";

beforeAll(() => {
  const elements: [HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLHeadingElement, HTMLHeadingElement] = [
    document.createElement("div"),
    document.createElement("div"),
    document.createElement("div"),
    document.createElement("div"),
    document.createElement("h1"),
    document.createElement("h2")
  ];

  elements[0].id = "first";
  elements[1].classList.add("divs");
  elements[2].classList.add("divs");
  elements[3].classList.add("divs");
  elements[4].classList.add("divs");
  elements[5].id = "last";

  document.body.append(...elements);
});

describe("$", () => {
  it("should select an element that exists", () => {
    expect($("div")).toBe(document.querySelector("div"));
    expect($("#first")).toBe(document.querySelector("#first"));
    expect($("#last")).toBe(document.querySelector("#last"));
    expect($("#middle")).toBeNull();
  });
});

describe("$$", () => {
  it("should select elements that exists", () => {
    expect($$("div").length).toBe(document.querySelectorAll("div")?.length);
    expect($$("#first").length).toBe(document.querySelectorAll("#first")?.length);
    expect($$(".divs").length).toBe(document.querySelectorAll(".divs")?.length);
    expect($$("#middle").length).toBe(0);
  });
});