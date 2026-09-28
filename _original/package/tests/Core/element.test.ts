import "opti";

describe("Element.txt", () => {
  let element: Element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it("should set text content", () => {
    element.txt("Test");
    expect(element.textContent).toBe("Test");
  });

  it("should get text content", () => {
    element.textContent = "Hello";
    expect(element.txt()).toBe("Hello");
  });

  it("should be able to set the content based on a function", () => {
    element.textContent = "Hello";
    element.txt(original => original + "_World");
    expect(element.textContent).toBe("Hello_World");
  });
});

describe("Element.html", () => {
  let element: Element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it("should set inner HTML content", () => {
    element.html('<p>Hello</p>');
    expect(element.innerHTML).toBe('<p>Hello</p>');
  });

  it("should be able to get html content", () => {
    element.innerHTML = "<p>Hello</p>";
    expect(element.html()).toBe("<p>Hello</p>");
  });
});

describe("Element.addClass", () => {
  let element: Element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it("should add a class to the element", () => {
    element.addClass('test-class');
    expect(element.classList.contains('test-class')).toBeTruthy();
  });
});

describe("Element.removeClass", () => {
  let element: Element;

  beforeEach(() => {
    element = document.createElement('div');
    element.classList.add('test-class');
  });

  it("should remove a class from the element", () => {
    element.removeClass('test-class');
    expect(element.classList.contains('test-class')).toBeFalsy();
  });
});

describe("Element.toggleClass", () => {
  let element: Element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it("should toggle a class on the element", () => {
    element.toggleClass('test-class');
    expect(element.classList.contains('test-class')).toBeTruthy();
    element.toggleClass('test-class');
    expect(element.classList.contains('test-class')).toBeFalsy();
  });
});

describe("Element.hasClass", () => {
  let element: Element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it("should return true if the element has the specified class", () => {
    element.classList.add('test-class');
    expect(element.hasClass('test-class')).toBeTruthy();
  });

  it("should return false if the element does not have the specified class", () => {
    expect(element.hasClass('test-class')).toBeFalsy();
  });
});

describe("HTMLElement.css", () => {
  let element: HTMLElement;

  beforeAll(() => {
    element = document.createElement('div');
    document.body.append(element);
  });

  afterAll(() => {
    element.remove();
    void element;
  });

  it("should be able to apply CSS styles to the element", () => {
    element.css({ color: 'red' });
    expect(element.style.color).toBe('red');

    element.css("color", "green");
    expect(element.style.color).toBe("green");
  });

  it("should be able to get all the styles from an element", () => {
    element.style.color = "red";
    element.style.backgroundColor = "green";
    element.style.fontWeight = "300";

    expect(element.css()).toStrictEqual<CSS.Object>({
      color: "red",
      backgroundColor: "green",
      fontWeight: 300
    });
  });

  it("should be able to return single values", () => {
    element.style.color = "red";
    element.style.backgroundColor = "green";
    element.style.fontWeight = "300";

    expect(element.css("color")).toBe("red");
    expect(element.css("backgroundColor")).toBe("green");
    expect(element.css("fontWeight")).toBe(300);
  });

  it("should be able to handle values that could be 0 accordingly", () => {
    element.style.opacity = "0";
    element.style.width = "0px";

    expect(element.css("opacity")).toBe(0);
    expect(element.css("width")).toBe(0);
  });

  it("should be able to handle invalid cases", () => {
    const original = window.getComputedStyle(element);
    element.css('accentColor', "nothing");
    element.css('color', 12);
    const computed = window.getComputedStyle(element);
    expect(computed.accentColor).toBeEither(original.accentColor, "rgba(0, 0, 0, 0)");
    expect(computed.color).toBeEither(original.color, "rgba(0, 0, 0, 0)");
  });

  it("should be able to return computed styles as well", () => {
    element.style.color = "rgb(254,0,0)";
    element.style.width = "100px";

    const styles = element.css(true);

    expect(styles.color).toBe("rgb(254, 0, 0)");
    expect(styles.width).toBe("100px");
    expect(styles.display).toBe("block");
  });

  it("should be able to reset the css value when null is provided", () => {
    element.style.color = "red";
    element.style.width = "100px";

    expect(element.style.color).toBe("red");
    expect(element.style.width).toBe("100px");

    element.css('color', null);
    element.css('width', null);

    expect(element.style.color).toBe("");
    expect(element.style.width).toBe("");
  });
});

describe("HTMLElement.show", () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it("should show the element", () => {
    element.hide();
    element.show();
    expect(element.style.visibility).toBe('visible');
  });
});

describe("HTMLElement.hide", () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it("should hide the element", () => {
    element.show(); // first show
    element.hide();
    expect(element.style.visibility).toBe('hidden');
  });
});

describe("HTMLElement.toggle", () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.visibility = 'visible';
  });

  it("should toggle the visibility of the element", () => {
    element.toggle();
    expect(element.style.visibility).toBe('hidden');
    element.toggle();
    expect(element.style.visibility).toBe('visible');
  });
});

describe("HTMLFormElement.serialize", () => {
  let el: HTMLFormElement;

  beforeEach(() => {
    el = document.createElement("form");
    document.body.append(el); // just in case serialization needs to be in DOM
  });

  afterEach(() => {
    el.remove(); // clean that up like a pro
  });

  it("should return empty string for empty form", () => {
    expect(el.serialize()).toBe("");
  });

  it("should serialize single input", () => {
    const input = document.createElement("input");
    input.name = "username";
    input.value = "broski";
    el.append(input);
    expect(el.serialize()).toBe("username=broski");
  });

  it("should serialize multiple inputs", () => {
    el = document.createElement("form");
    
    const user = document.createElement("input");
    user.name = "user";
    user.value = "broski";

    const age = document.createElement("input");
    age.name = "age";
    age.value = "15";

    el.append(user, age);
    expect(el.serialize()).toBe("user=broski&age=15");
  });

  it("should skip inputs without name", () => {
    const skip = document.createElement("input");
    skip.value = "npc";

    const keep = document.createElement("input");
    keep.name = "real";
    keep.value = "W";

    el.append(skip, keep);
    expect(el.serialize()).toBe("real=W");
  });

  it("should only serialize checked checkboxes", () => {
    const cb1 = document.createElement("input");
    cb1.type = "checkbox";
    cb1.name = "sub";
    cb1.value = "yes";
    cb1.checked = true;

    const cb2 = document.createElement("input");
    cb2.type = "checkbox";
    cb2.name = "sub";
    cb2.value = "no";
    cb2.checked = false;

    el.append(cb1, cb2);
    expect(el.serialize()).toBe("sub=yes");
  });

  it("should only include selected radio", () => {
    const r1 = document.createElement("input");
    r1.type = "radio";
    r1.name = "plan";
    r1.value = "basic";

    const r2 = document.createElement("input");
    r2.type = "radio";
    r2.name = "plan";
    r2.value = "premium";
    r2.checked = true;

    el.append(r1, r2);
    expect(el.serialize()).toBe("plan=premium");
  });

  it("should URL-encode keys and values", () => {
    const input = document.createElement("input");
    input.name = "user name";
    input.value = "bro ski";

    el.append(input);
    expect(el.serialize()).toBe("user%20name=bro%20ski");
  });
});

describe("HTMLInputElement.val", () => {
  const el: HTMLInputElement = document.createElement("input");

  it("should return an empty value for empty input elements", () => {
    expect(el.val.asString()).toBe("");
  });

  it("should return a value when the input element has content", () => {
    el.value = "Hello";

    expect(el.val.asString()).toBe("Hello");
    expect(el.val.asNumber()).toBeNull();
    expect(el.val.asBoolean()).toBeNull();
    expect(el.val.asDate()).toBeNull();
  });
});

describe("HTMLElement.isVisible", () => {
  beforeAll(() => {
    const styles = document.createElement("style");
    styles.innerHTML = `
      footer, div, section, article, header { display: block; }
      span, a, b, i { display: inline; }
      body { margin: 8px; }
      * { opacity: 1; visibility: visible; }
    `;
    document.head.appendChild(styles);
  });

  afterAll(() => {
    document.head.innerHTML = "";
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should return true for normally created and appended elements", () => {
    const el1 = document.createElement("footer");
    const el2 = document.createElement("div");

    document.body.append(el1, el2);

    expect(el1.isVisible).toBe(true);
    expect(el2.isVisible).toBe(true);
  });

  it("should return false when visibility is set to hidden or display is set to none", () => {
    const el1 = document.createElement("footer");
    const el2 = document.createElement("div");

    document.body.append(el1, el2);

    el1.style.visibility = "hidden";
    el2.style.display = "none";

    expect(el1.isVisible).toBe(false);
    expect(el2.isVisible).toBe(false);
  });

  it("should return false when the element isn't in the DOM", () => {
    const el1 = document.createElement("footer");
    const el2 = document.createElement("div");

    expect(el1.isVisible).toBe(false);
    expect(el2.isVisible).toBe(false);
  });

  it("should return false when the opacity of elements is set to 0", () => {
    const el1 = document.createElement("footer");
    const el2 = document.createElement("div");
    
    el1.style.opacity = "0";
    el2.style.opacity = "0";

    expect(el1.isVisible).toBe(false);
    expect(el2.isVisible).toBe(false);
  });
});