let state = undefined;
let lookup = {};

// getter function to get the state
function getState(key) {
  return state[key];
}

// Set state only through this
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
        // Handle tags which listen to a particular state value

        // Add this element to a lookup, which can be used later when the state gets updated
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

// renders dom element to the root;
function render(el) {
  state = state || dom.script.state;
  const res = makeHTML(dom.AST);
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
  el.appendChild(res);
}
