import "opti";

describe("NodeList.addClass, NodeList.removeClass, NodeList.toggleClass", () => {
  let nodeList: NodeListOf<Element>;

  beforeEach(() => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    document.body.append(div1);
    document.body.append(div2);
    div1.classList.add('item');
    div2.classList.add('item');
    nodeList = document.querySelectorAll('div');
  });

  it("should add the class to each element", () => {
    nodeList.addClass('new-class');
    expect(nodeList[0]?.classList.contains('new-class')).toBeTruthy();
    expect(nodeList[1]?.classList.contains('new-class')).toBeTruthy();
  });

  it("should remove the class from each element", () => {
    nodeList.removeClass('item');
    expect(nodeList[0]?.classList.contains('item')).toBeFalsy();
    expect(nodeList[1]?.classList.contains('item')).toBeFalsy();
  });

  it("should toggle the class of each element", () => {
    nodeList.toggleClass('item');
    expect(nodeList[0]?.classList.contains('item')).toBeTruthy();
    expect(nodeList[1]?.classList.contains('item')).toBeTruthy();

    nodeList.toggleClass('item');
    expect(nodeList[0]?.classList.contains('item')).toBeFalsy();
    expect(nodeList[1]?.classList.contains('item')).toBeFalsy();
  });
});

describe("HTMLCollection.addClass, HTMLCollection.removeClass, HTMLCollection.toggleClass", () => {
  let htmlCollection: HTMLCollectionOf<HTMLDivElement>;

  beforeEach(() => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    document.body.append(div1);
    document.body.append(div2);
    div1.classList.add('item');
    div2.classList.add('item');
    htmlCollection = document.getElementsByTagName('div');
  });

  it("should add the class to each element", () => {
    //@ts-ignore
    htmlCollection.addClass('new-class');
    expect(htmlCollection[0]?.classList.contains('new-class')).toBeTruthy();
    expect(htmlCollection[1]?.classList.contains('new-class')).toBeTruthy();
  });

  it("should add the class to each element", () => {
    //@ts-ignore
    htmlCollection.removeClass('item');
    expect(htmlCollection[0]?.classList.contains('item')).toBeFalsy();
    expect(htmlCollection[1]?.classList.contains('item')).toBeFalsy();
  });
});