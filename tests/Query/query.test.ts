beforeAll(() => {
  const elements = [
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
    expect($$("div")).toBe(document.querySelectorAll("div"));
    expect($$("#first")).toBe(document.querySelectorAll("#first"));
    expect($$(".divs")).toBe(document.querySelectorAll(".divs"));
    expect($$("#middle").length).toBe(0);
  });
});