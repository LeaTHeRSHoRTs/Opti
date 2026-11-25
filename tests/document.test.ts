import 'opti';

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
    it("should run when the user attempts to leave using beforeunload", () => {
        const callback = vi.fn();
    
        document.leaving(callback);
        window.dispatchEvent(new Event("beforeunload"));
    
        expect(callback).toHaveBeenCalledOnce();
    });
    
    it("should run when the user attempts to leave using pagehide", () => {
        const callback = vi.fn();
    
        document.leaving(callback);
        window.dispatchEvent(new Event("pagehide"));
    
        expect(callback).toHaveBeenCalledOnce();
    });
    
    it("should run when the user attempts to leave using visibilitychange", () => {
        const callback = vi.fn();
    
        Object.defineProperty(document, "visibilityState", {
            configurable: true,
            value: "hidden"
        });
    
        document.leaving(callback);
        document.dispatchEvent(new Event("visibilitychange"));
    
        expect(callback).toHaveBeenCalledOnce();
    });
});

describe("Document.css", () => {
    it("should set the css for an element", () => {
        const div = document.createElement('div');
        div.className = "target";
        document.body.appendChild(div);

        document.css("div.target", {
            color: "red"
        });

        const sheet = document.querySelector<HTMLStyleElement>("style[js-styles]")?.sheet;

        expect(sheet).toBeDefined();

        const rule = Array.from(sheet?.cssRules ?? []).find(r => 
            r instanceof CSSStyleRule && r.selectorText === "div.target"
        ) as CSSStyleRule | null;

        expect(rule).toBeDefined();
        expect(rule?.style.color).toBe("red");
    });

    it("should be able to get the css for an element", () => {
        const div = document.createElement('div');
        div.className = "target";
        document.body.appendChild(div);

        const styleSheet = document.createElement('style');
        document.head.appendChild(styleSheet);

        expect(styleSheet.sheet).toBeDefined();

        // oxlint-disable-next-line typescript/no-non-null-assertion
        styleSheet.sheet!.insertRule("div.target { color: red; font-size: 20px }");

        expect(document.css("div.target")).toHaveProperty("color");
        expect(document.css("div.target").color).toBe("red");
    });

    it("should throw if no selector is specified", () => {
        expect(() => {
            document.css("");
        }).toThrow(SyntaxError);
    });
});

afterAll(() => {
    document.body.innerHTML = "";
});