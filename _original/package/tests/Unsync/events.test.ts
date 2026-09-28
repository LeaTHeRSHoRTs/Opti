import "opti";
import "opti/unsync";

describe("EventTarget.addConditionalListener", () => {
  it("should cancel the listener after `x` amount of times", () => {
    const div = document.createElement("div");
    document.body.append(div);

    let count = 0;

    div.addConditionalListener("click", () => {
      count++;
    }, 2); // Only allow the listener to run twice

    div.click();
    div.click();
    div.click(); // This one should not increase the count

    expect(count).toBe(2);
  });

  it("should cancel the listener when the condition specified returns true", () => {
    const div = document.createElement("div");
    document.body.append(div);

    let ran = false;

    div.addConditionalListener("click", () => {
      ran = true;
    }, () => ran);
  });
});

describe("EventTarget.addEventListeners", () => {
  it("should attach multiple event listeners to the object", () => {
    let flag1 = false;
    let flag2 = false;

    const multi = document.createElement("div");
    document.body.appendChild(multi);

    multi.addEventListeners({
      click: () => flag1 = true,
      mouseover: () =>  flag2 = true
    });

    multi.dispatchEvent(new MouseEvent("mouseover"));
    multi.dispatchEvent(new MouseEvent("click"));

    expect(flag1).toBeTruthy();
    expect(flag2).toBeTruthy();
  });

  it("should attach multiple event listeners to the object", () => {
    const single = document.createElement("div");
    document.body.appendChild(single);

    let flag = 0;
    single.addEventListeners(["mouseover", "click"], () => {
      flag++;
    });

    single.dispatchEvent(new MouseEvent("mouseover"));
    single.dispatchEvent(new MouseEvent("click"));

    expect(flag).toBe(2);
  });
});

describe("EventTarget.addEventController", () => {
  let el: HTMLButtonElement;

  beforeAll(() => {
    el = document.createElement("button");
    document.body.append(el);
  });

  afterAll(() => document.body.innerHTML = ""); 

  it("should attach an event listener to the EventTarget", () => {
    let flag = false;
    el.addEventController("click", () => flag = true);
    el.click();

    expect(flag).toBeTruthy();
  });

  it("should be abe to be turned off", () => {
    let flag = 1;

    const controller = el.addEventController('click', () => flag++);
    el.click();

    expect(flag).toBe(2);
    controller.off();

    el.click();
    expect(flag).toBe(2);
  });

  it("should be able to return the status of the listener", () => {
    let flag = 1;

    const controller = el.addEventController('click', () => flag++);
    expect(controller.applied).toBeTruthy();
    controller.off();
    expect(controller.applied).toBeFalsy();
    controller.on();
    expect(controller.applied).toBeTruthy();
  });

  it("should be able to handle an already true status", () => {
    expect(() => {
      const controller = el.addEventController('click', () => {});
      expect(controller.applied).toBeTruthy();
      controller.off();
      controller.off();
      expect(controller.applied).toBeFalsy();
    }).not.toThrow();
  });
});

describe("EventTarget.addConditionalListener", () => {
  let el: HTMLButtonElement;

  beforeAll(() => {
    el = document.createElement("button");
    document.body.append(el);
  });

  afterAll(() => document.body.innerHTML = ""); 

  it("should attach an event listener to the EventTarget", () => {
    let flag = false;
    el.addConditionalListener("click", () => flag = true, 2);
    el.click();

    expect(flag).toBeTruthy();
  });

  it("should be removed after a certain amount of activations", () => {
    let flag = 0;

    el.addConditionalListener('click', () => flag++, 3);

    el.click();
    expect(flag).toBe(1);

    el.click();
    expect(flag).toBe(2);

    el.click();
    expect(flag).toBe(3);
    
    el.click();
    expect(flag).toBe(3);
  });

  it("should be removed after the condition returns true", () => {
    let flag = false;
    let incr = 0;

    el.addConditionalListener('click', () => incr++, () => flag === true);

    el.click();
    expect(incr).toBe(1);

    el.click();
    expect(incr).toBe(2);

    flag = true;
    el.click();
    expect(incr).toBe(2);

    flag = false;
    el.click();
    expect(incr).toBe(2);
  });
});

describe("NodeList.addEventListener", () => {
  let nodeList: NodeList;

  beforeEach(() => {
    document.body.append(document.createElement('div'));
    document.body.append(document.createElement('div'));
    nodeList = document.querySelectorAll('div');
  });

  it("should be defined", () => {
    expect(nodeList.addEventListener).toBeDefined();
  });
});

describe("HTMLCollection.addEventListener", () => {
  let htmlCollection: HTMLCollectionOf<HTMLDivElement>;

  beforeEach(() => {
    document.body.append(document.createElement('div'));
    document.body.append(document.createElement('div'));
    htmlCollection = document.getElementsByTagName('div');
  });

  it("should be defined", () => {
    expect((htmlCollection as any).addEventListener).toBeDefined();
  });
});