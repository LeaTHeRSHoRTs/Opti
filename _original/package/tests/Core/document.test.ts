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
  it("should run when the user attempts to leave using beforeunload", async () => {
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

  it("should run when the user attempts to leave using pagehide", async () => {
    const promise = new Promise<void>((resolve) => {
      document.leaving(() => {
        expect(true).toBeTruthy();
        resolve();
      });
    });

    // Simulate leaving the document
    window.dispatchEvent(new Event("pagehide"));

    await promise;
  }, 10_000);

  it("should run when the user attempts to leave using visibilitychange", async () => {
    const promise = new Promise<void>((resolve) => {
      document.leaving(() => {
        expect(true).toBeTruthy();
        resolve();
      });
    });

    // Simulate leaving the document
    document.dispatchEvent(new Event("visibilitychange"));

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

  it("should throw if no selector is specified", () => {
    expect(() => {
      document.css("");
    }).toThrowException(SyntaxException);
  });
});

afterAll(() => {
  document.body.innerHTML = "";
});