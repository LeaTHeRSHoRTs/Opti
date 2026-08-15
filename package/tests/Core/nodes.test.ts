import "opti";

describe("Node.getParent", () => {
    it("should return the direct parent element", () => {
        const parent = document.createElement("div");
        const child = document.createElement("span");
        parent.appendChild(child);
        document.body.appendChild(parent);

        expect(child.getParent()).toBe(parent);
    });
});

describe("Node.getAncestor", () => {
    it("should return the closest matching ancestor", () => {
        const ancestor = document.createElement("section");
        const parent = document.createElement("div");
        const child = document.createElement("span");

        ancestor.classList.add("target");
        ancestor.appendChild(parent);
        parent.appendChild(child);
        document.body.appendChild(ancestor);

        expect(child.getAncestor(".target")).toBe(ancestor);
    });

    it("should return null if no matching ancestor", () => {
        const parent = document.createElement("div");
        const child = document.createElement("span");

        parent.appendChild(child);
        document.body.appendChild(parent);

        expect(child.getAncestor("footer")).toBeNull();
    });

    it("should return the direct parent when level is 1", () => {
        const grandparent = document.createElement("div");
        const parent = document.createElement("section");
        const child = document.createElement("span");

        grandparent.appendChild(parent);
        parent.appendChild(child);
        document.body.appendChild(grandparent);

        // level 1 → direct parent
        expect(child.getAncestor(1)).toBe(parent);
    });

    it("should return the grandparent when level is 2", () => {
        const great = document.createElement("article");
        const grandparent = document.createElement("div");
        const parent = document.createElement("section");
        const child = document.createElement("span");

        great.appendChild(grandparent);
        grandparent.appendChild(parent);
        parent.appendChild(child);
        document.body.appendChild(great);

        // level 2 → grandparent
        expect(child.getAncestor(2)).toBe(grandparent);
    });

    it("should return null if the requested level exceeds tree depth", () => {
        const parent = document.createElement("div");
        const child = document.createElement("span");

        parent.appendChild(child);
        document.body.appendChild(parent);

        // Only one ancestor exists; level 2 should be null
        expect(child.getAncestor(100)).toBeNull();
    });

    it("should return the node itself when level is 0", () => {
        const node = document.createElement("div");
        document.body.appendChild(node);

        // level 0 → the node itself
        expect(node.getAncestor(0)).toBe(node);
    });

    it("should return the closest ancestor of a text node", () => {
        const ancestor = document.createElement("section");
        const parent = document.createElement("div");
        const child = document.createTextNode("span");

        ancestor.classList.add("target");
        ancestor.appendChild(parent);
        parent.appendChild(child);
        document.body.appendChild(ancestor);

        expect(child.getAncestor(1)).toBe(parent);
    });
});

describe("Node.getChildren", () => {
    it("should return all element children", () => {
        const parent = document.createElement("div");
        const child1 = document.createElement("p");
        const child2 = document.createElement("span");

        parent.appendChild(child1);
        parent.appendChild(child2);
        document.body.appendChild(parent);

        const children = parent.getChildren();
        expect(children).toContain(child1);
        expect(children).toContain(child2);
        expect(children.length).toBe(2);
    });
});

describe("Node.getSiblings", () => {
    it("should return all siblings excluding self", () => {
        const parent = document.createElement("div");
        const child1 = document.createElement("span");
        const child2 = document.createElement("a");

        parent.appendChild(child1);
        parent.appendChild(child2);
        document.body.appendChild(parent);

        const siblings = child1.getSiblings();
        expect(siblings).toContain(child2);
        expect(siblings).not.toContain(child1);
    });

    it("should return all siblings including itself when inclusive is set to true", () => {
        const parent = document.createElement("div");
        const child1 = document.createElement("span");
        const child2 = document.createElement("a");

        parent.appendChild(child1);
        parent.appendChild(child2);
        document.body.appendChild(parent);

        const siblings = child1.getSiblings(true);
        expect(siblings).toContain(child2);
        expect(siblings).toContain(child1);
    });
});

describe("Element.cut", () => {
    it("should be able to cut an element from the DOM", () => {
        const element = document.createElement('div');
        element.id = "removed";
        document.body.appendChild(element);

        element.cut();

        expect(document.getElementById("removed")).toBeNull();
    });

    it("should throw if it tries to detach an invalid element", () => {
        const el = document.createElement('div');
        expect(() => el.cut()).toThrowException(HierarchyException);
    });
});

describe("Element.copy", () => {
    it("should be able to copy an element's basic properties", () => {
        const el = document.createElement('div');
        el.innerHTML = "<p>Text</p>";
        el.title = "My Title";
        el.role = "text",
                el.ariaChecked = "true",
                el.hidden = true,
                el.tabIndex = 1,
                el.id = "one";
        el.className = "two";
        el.style.display = "none";
        el.style.color = "red",
                el.dataset["id"] = "one";
        el.dataset["name"] = "MyName";

        const copy = el.copy();

        expect(copy.tagName).toBe('DIV');
        expect(copy).toHaveTextContent("Text");

        expect(copy).toHaveAttribute("title", "My Title");
        expect(copy).toHaveAttribute("role", "text");
        expect(copy).toHaveAttribute("aria-checked");
        expect(copy).toHaveAttribute("id", "");
        expect(copy).toHaveAttribute("tabindex", "1");
        expect(copy).toHaveAttribute("hidden");
        expect(copy).toHaveClass("two");
        expect(copy.style.color).toBe('red');
        expect(copy.style.display).toBe('none');
        expect(copy).toHaveAttribute("data-id", "one");
        expect(copy).toHaveAttribute("data-name", "MyName");
    });

    it("should be able to copy over attributes of special elements", () => {
        const input = document.createElement('input');
        const link = document.createElement('a');
        const img = document.createElement('img');
        const select = document.createElement('select');
        const option = document.createElement('option');

        input.value = "Some input";
        input.placeholder = "Input placeholder";
        input.disabled = true;

        link.href = "https://example.org";
        img.src = "https://example.org/image";

        select.innerHTML = `
      <option value="a">A</option>
      <option value="b" selected>B</option>
    `;
        select.value = "b";

        option.value = "c";
        option.text = "Option";
        option.selected = true;

        const imgCopy = img.copy();
        const linkCopy = link.copy();
        const inputCopy = input.copy();
        const selectCopy = select.copy();
        const optionCopy = option.copy();

        document.body.append(
                imgCopy,
                linkCopy,
                inputCopy,
                selectCopy,
                optionCopy
        );

        expect(imgCopy).toHaveAttribute("src", "https://example.org/image");
        expect(linkCopy).toHaveAttribute("href", "https://example.org");
        expect(inputCopy).toHaveValue("Some input");
        expect(inputCopy).toHaveAttribute('placeholder', "Input placeholder");
        expect(inputCopy).toHaveAttribute('disabled');

        expect(selectCopy.value).toBe("b");
        expect(selectCopy.selectedIndex).toBe(1);

        expect(optionCopy).toHaveAttribute('value', "c");
        expect(optionCopy.text).toBe("Option");
        expect(optionCopy).toHaveAttribute('selected');
    });

    it("should support the boolean children options", () => {
        const el = document.createElement('div');
        const child1 = document.createElement('p');
        const child2 = document.createElement('p');
        child1.className = "child1";
        child2.className = "child2";
        el.innerHTML = "<p>Text</p>";
        el.title = "My Title";
        el.role = "text",
                el.ariaChecked = "true",
                el.hidden = true,
                el.tabIndex = 1,
                el.id = "one";
        el.className = "two";
        el.style.display = "none";
        el.style.color = "red",
                el.dataset["id"] = "one";
        el.dataset["name"] = "MyName";
        el.append(child1, child2);

        const copy = el.copy(true);
        document.body.append(copy);

        expect(copy.querySelector(".child1")).toBeInTheDocument();
        expect(copy.querySelector(".child1")).toBeInTheDocument();
        expect(copy.childElementCount).toBe(2);
    });

    it("should support the object options", () => {
        const el = document.createElement('div');
        const child1 = document.createElement('p');
        const child2 = document.createElement('p');
        child1.className = "child1";
        child2.className = "child2";
        el.innerHTML = "<p>Text</p>";
        el.title = "My Title";
        el.role = "text",
                el.ariaChecked = "true",
                el.hidden = true,
                el.tabIndex = 1,
                el.id = "one";
        el.className = "two";
        el.style.display = "none";
        el.style.color = "red",
                el.dataset["id"] = "one";
        el.dataset["name"] = "MyName";
        el.append(child1, child2);

        const copy = el.copy({
            fallbackId: "fallback",
            copyAttributes: true,
            copyChildren: true,
            copyStyles: false
        });
        document.body.append(copy);

        expect(copy).toHaveAttribute('id', "fallback");
        expect(copy).toHaveClass("two");

        expect(copy.style.display).not.toBe("none");
        expect(copy.style.color).not.toBe("red");

        expect(copy.querySelector(".child1")).toBeInTheDocument();
        expect(copy.querySelector(".child1")).toBeInTheDocument();
    });
});

describe("Node.$", () => {
    it("should return the first matching descendant", () => {
        const root = document.createElement("div");
        const match = document.createElement("b");

        root.appendChild(match);
        document.body.appendChild(root);

        expect(root.$("b")).toEqual(match);
    });

    it("should return null if no match is found", () => {
        const root = document.createElement("div");
        document.body.appendChild(root);

        expect(root.$("section")).toBeNull();
    });

    it("should support complex selectors", () => {
        const inner = document.createElement("p");
        const outside = document.createElement("div");

        outside.appendChild(inner);
        document.body.appendChild(outside);

        inner.className = "x";
        inner.id = "outsider";
        inner.setAttribute("data-test", "testing");

        expect(outside.$(".x#outsider[data-test=testing]")).toBe(inner);
        expect(outside.$(".x#outsider[data-test=wrong]")).toBeNull();
    });

    it("should error out and tell users that commas are not allowed", () => {
        expect(() => document.$("div, p")).toThrowException(SyntaxException, "Invalid query: commas are not allowed in query selectors that can only select 1 element");
    });
});

describe("Node.$$", () => {
    it("should return all matching descendants", () => {
        const root = document.createElement("div");
        const em1 = document.createElement("em");
        const em2 = document.createElement("em");

        root.appendChild(em1);
        root.appendChild(em2);
        document.body.appendChild(root);

        const found = root.$$("em");
        expect(found).toContain(em1);
        expect(found).toContain(em2);
        expect(found.length).toBe(2);
    });

    it("should return an empty array if no matches", () => {
        const root = document.createElement("div");
        document.body.appendChild(root);

        const found = root.$$("footer");
        expect(found).toHaveLength(0);
    });

    it("should support more advanced selectors", () => {
        const root = document.createElement("div");
        const em1 = document.createElement("em");
        const em2 = document.createElement("em");

        em1.id = "child1";
        em1.className = "target";
        em1.setAttribute("data-test", "testing");
        em2.id = "child2";
        em2.className = "target";
        em2.setAttribute("data-test", "testing");

        root.appendChild(em1);
        root.appendChild(em2);
        document.body.appendChild(root);

        const found = root.$$(".target#child1[data-test=testing], .target#child2[data-test=testing]");
        expect(found).toContain(em1);
        expect(found).toContain(em2);
        expect(found.length).toBe(2);
    });
});