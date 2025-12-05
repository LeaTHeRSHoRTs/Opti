import "../../dist/opti";

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
    //@ts-ignore
    expect(nodeList[0].classList.contains('new-class')).toBeTruthy();
    //@ts-ignore
    expect(nodeList[1].classList.contains('new-class')).toBeTruthy();
  });

  it("should add the class to each element", () => {
    nodeList.removeClass('item');
    //@ts-ignore
    expect(nodeList[0].classList.contains('item')).toBeFalsy();
    //@ts-ignore
    expect(nodeList[1].classList.contains('item')).toBeFalsy();
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
    expect(htmlCollection[0].classList.contains('new-class')).toBeTruthy();
    expect(htmlCollection[1].classList.contains('new-class')).toBeTruthy();
  });

  it("should add the class to each element", () => {
    //@ts-ignore
    htmlCollection.removeClass('item');
    expect(htmlCollection[0].classList.contains('item')).toBeFalsy();
    expect(htmlCollection[1].classList.contains('item')).toBeFalsy();
  });
});