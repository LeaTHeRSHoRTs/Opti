import "opti";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("Document.ready", () => {
  it("should run on DOMContentLoaded", async () => {
    const promise = new Promise<void>((resolve) => {
      document.ready(() => {
        expect(true).toBeTruthy();
        resolve();
      });
    });

    document.dispatchEvent(new Event("DOMContentLoaded"));

    await promise;
  });
});

describe("Document.leaving", () => {
  it("should run when the user attempts to leave", async () => {
    const promise = new Promise<void>((resolve) => {
      document.leaving(() => {
        expect(true).toBeTruthy();
        resolve();
      });
    });

    // Simulate leaving the document
    window.dispatchEvent(new Event("beforeunload"));

    await promise;
  }, 10_000);
});

describe("Document.css", () => {
  it("should set the css for an element", () => {
    const div = document.createElement("div");
    div.className = "target";
    document.body.appendChild(div);

    document.css("div.target", {
      color: "red"
    });

    const sheet = document.styleSheets[0];
    const rule = Array.from(sheet?.cssRules ?? []).find(r => 
      r instanceof CSSStyleRule && r.selectorText === "div.target"
    ) as CSSStyleRule | undefined;

    expect(rule).toBeDefined();
    expect(rule?.style.color).toBe("red");
  });

  it("should be able to get the css for an element", () => {
    const div = document.createElement("div");
    div.className = "target";
    document.body.appendChild(div);

    const styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);

    styleSheet.sheet?.insertRule("div.target { color: red; font-size: 20px }");

    expect(document.css("div.target")).toHaveProperty("color");
    expect(document.css("div.target").color).toBe("red");
  });
});

describe("Document.createElements", () => {
  it("debug check", () => {
    console.log('Available keys:', Object.keys(Document.prototype));
    expect(document.createElements).toBeDefined();
  });

  it("should create an element cascade and append to the body", () => {
    const el = document.createElements({ 
      tag: "div", 
      children: { tag: "a" }
    });

    document.body.appendChild(el);

    const divs = document.body.getElementsByTagName("div");
    expect(divs).toHaveLength(1);

    const anchors = divs[0]?.getElementsByTagName("a");
    expect(anchors).toHaveLength(1);

    // Optional: check if the created div is actually a child of body
    expect(document.body.contains(el)).toBeTruthy();
  });
  
  it("should be able to add keyed properties", () => {
    expect(() => {
      document.createElements({ 
        tag: "div", 
        "data-href": "32",
        children: { 
          tag: "a",
          "data-style": "position: absolute;"
        }
      });
    }).not.toThrow();
  });

  it("should not be able to add keyed properties if they aren't a string", () => {
    expect(() => {
      document.createElements({ 
        tag: "div", 
        "data-href": "32",
        children: { 
          tag: "a",
          "data-style": { 
            position: "absolute"
          }
        }
      });
    }).toThrow();
  });
});

afterAll(() => {
  document.body.innerHTML = "";
});