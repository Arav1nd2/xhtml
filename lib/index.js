let state = undefined;
let lookup = {};

function getState(key) {
  return state[key];
}

function updateState(key, newValue) {
  state[key] = newValue;
  lookup[key].forEach((el) => {
    el.innerText = state[key];
  });
}

const makeHTML = (dom) => {
  if (dom.type) {
    let el = document.createElement(dom.type === "template" ? "div" : dom.type);
    let flag = false;
    Object.keys(dom.attributes).forEach((attr) => {
      if (attr === "xData") {
        lookup[dom.attributes[attr]] = lookup[dom.attributes[attr]]
          ? [...lookup[dom.attributes[attr]], el]
          : [el];
        let val = getState(dom.attributes[attr]);
        el.innerText = val;
        flag = true;
      } else if (attr === "xModel") {
        el.value = state[dom.attributes[attr]];
        el.addEventListener("input", (event) => {
          updateState(dom.attributes[attr], event.target.value);
        });
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
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
  el.appendChild(res);
}
