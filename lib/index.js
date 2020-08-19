let state = undefined;

function getState(key) {
  return state[key];
}

const makeHTML = (dom) => {
  if (dom.type) {
    let el = document.createElement(dom.type === "template" ? "div" : dom.type);
    let flag = false;
    Object.keys(dom.attributes).forEach((attr) => {
      if (attr === "xData") {
        let val = getState(dom.attributes[attr]);
        el.innerText = val;
        flag = true;
      } else {
        let attribute = document.createAttribute(attr);
        attribute.value = dom.attributes[attr];
        el.setAttributeNode(attribute);
      }
    });
    if (flag) {
      return el;
    }
    let children = document.createDocumentFragment();
    if (dom.children === null) {
      return el;
    }
    dom.children
      .map((child) => makeHTML(child))
      .forEach((childHTML) => children.appendChild(childHTML));
    el.appendChild(children);
    return el;
  } else {
    return document.createTextNode(dom.text);
  }
};

function render(el) {
  state = state || dom.script.state;
  const res = makeHTML(dom.AST);
  el.appendChild(res);
}
