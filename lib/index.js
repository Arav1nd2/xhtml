function makeHTML(dom) {
  if (dom.type) {
    let el = document.createElement(dom.type === "template" ? "div" : dom.type);
    Object.keys(dom.attributes).forEach((attr) => {
      let attribute = document.createAttribute(attr);
      attribute.value = dom.attributes[attr];
      el.setAttributeNode(attribute);
    });
    let children = document.createDocumentFragment();
    dom.children
      .map((child) => makeHTML(child))
      .forEach((childHTML) => children.appendChild(childHTML));
    el.appendChild(children);
    return el;
  } else {
    return document.createTextNode(dom.text);
  }
}

function render(el) {
  const res = makeHTML(dom.AST);
  el.appendChild(res);
}
