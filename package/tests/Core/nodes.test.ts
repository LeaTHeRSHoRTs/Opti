import "opti";

describe("Node.parent", () => {
  it("should return the direct parent element", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.appendChild(child);
    document.body.appendChild(parent);

    expect(child.parent()).toBe(parent);
  });
});

describe("Node.ancestor", () => {
  it("should return the closest matching ancestor", () => {
    const ancestor = document.createElement("section");
    const parent = document.createElement("div");
    const child = document.createElement("span");

    ancestor.classList.add("target");
    ancestor.appendChild(parent);
    parent.appendChild(child);
    document.body.appendChild(ancestor);

    expect(child.ancestor(".target")).toBe(ancestor);
  });

  it("should return null if no matching ancestor", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");

    parent.appendChild(child);
    document.body.appendChild(parent);

    expect(child.ancestor("footer")).toBeNull();
  });

  it("should return the direct parent when level is 1", () => {
    const grandparent = document.createElement("div");
    const parent = document.createElement("section");
    const child = document.createElement("span");

    grandparent.appendChild(parent);
    parent.appendChild(child);
    document.body.appendChild(grandparent);

    // level 1 → direct parent
    expect(child.ancestor(1)).toBe(parent);
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
    expect(child.ancestor(2)).toBe(grandparent);
  });

  it("should return null if the requested level exceeds tree depth", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");

    parent.appendChild(child);
    document.body.appendChild(parent);

    // Only one ancestor exists; level 2 should be null
    expect(child.ancestor(100)).toBeNull();
  });

  it("should return the node itself when level is 0", () => {
    const node = document.createElement("div");
    document.body.appendChild(node);

    // level 0 → the node itself
    expect(node.ancestor(0)).toBe(node);
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

describe("Node.siblings", () => {
  it("should return all siblings excluding self", () => {
    const parent = document.createElement("div");
    const child1 = document.createElement("span");
    const child2 = document.createElement("a");

    parent.appendChild(child1);
    parent.appendChild(child2);
    document.body.appendChild(parent);

    const siblings = child1.siblings();
    expect(siblings).toContain(child2);
    expect(siblings).not.toContain(child1);
  });
});

describe("Node.$", () => {
  it("should return the first matching descendant", () => {
    const root = document.createElement("div");
    const match = document.createElement("b");

    root.appendChild(match);
    document.body.appendChild(root);

    expect(root.$("b")).toBe(match);
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