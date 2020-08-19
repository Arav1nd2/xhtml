"use strict";

var state = undefined;

function getState(key) {
  return state[key];
}

var makeHTML = function makeHTML(dom) {
  if (dom.type) {
    var el = document.createElement(dom.type === "template" ? "div" : dom.type);
    var flag = false;
    Object.keys(dom.attributes).forEach(function (attr) {
      if (attr === "xData") {
        var val = getState(dom.attributes[attr]);
        el.innerText = val;
        flag = true;
      } else {
        var attribute = document.createAttribute(attr);
        attribute.value = dom.attributes[attr];
        el.setAttributeNode(attribute);
      }
    });
    if (flag) {
      return el;
    }
    var children = document.createDocumentFragment();
    if (dom.children === null) {
      return el;
    }
    dom.children.map(function (child) {
      return makeHTML(child);
    }).forEach(function (childHTML) {
      return children.appendChild(childHTML);
    });
    el.appendChild(children);
    return el;
  } else {
    return document.createTextNode(dom.text);
  }
};

function render(el) {
  state = state || dom.script.state;
  var res = makeHTML(dom.AST);
  el.appendChild(res);
}
"use strict";

var dom = { "AST": { "type": "template", "attributes": {}, "children": [{ "type": "div", "attributes": {}, "children": [{ "type": "h1", "attributes": { "class": "hello", "name": "aravind" }, "children": [{ "text": "This is a template" }] }, { "type": "p", "attributes": { "xData": "paragraph" }, "children": null }, { "type": "input", "attributes": { "name": "hello" }, "children": null }] }] }, "script": { "state": { "paragraph": "This is awesome" } } };
