"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var state = undefined;
var lookup = {};

// getter function to get the state
function getState(key) {
  return state[key];
}

// Set state only through this
function updateState(key, newValue) {
  state[key] = newValue;
  lookup[key].forEach(function (el) {
    el.innerText = state[key];
  });
}

var makeHTML = function makeHTML(dom) {
  if (dom.type) {
    var el = document.createElement(dom.type === "template" ? "div" : dom.type);
    var flag = false;
    Object.keys(dom.attributes).forEach(function (attr) {
      if (attr === "xData") {
        // Handle tags which listen to a particular state value

        // Add this element to a lookup, which can be used later when the state gets updated
        lookup[dom.attributes[attr]] = lookup[dom.attributes[attr]] ? [].concat(_toConsumableArray(lookup[dom.attributes[attr]]), [el]) : [el];
        var val = getState(dom.attributes[attr]);
        el.innerText = val;
        flag = true;
      } else if (attr === "xModel") {
        lookup[dom.attributes[attr]] = lookup[dom.attributes[attr]] ? [].concat(_toConsumableArray(lookup[dom.attributes[attr]]), [el]) : [el];
        el.value = state[dom.attributes[attr]];
        el.addEventListener("input", function (event) {
          updateState(dom.attributes[attr], event.target.value);
        });
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
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
  el.appendChild(res);
}
"use strict";

var dom = { "AST": { "type": "template", "attributes": {}, "children": [{ "type": "div", "attributes": {}, "children": [{ "type": "h1", "attributes": { "class": "hello", "name": "aravind" }, "children": [{ "text": "This is a template" }] }, { "type": "p", "attributes": { "xData": "paragraph" }, "children": null }, { "type": "input", "attributes": { "name": "hello", "xModel": "paragraph" }, "children": null }, { "type": "input", "attributes": { "name": "world", "xModel": "body" }, "children": null }, { "type": "h3", "attributes": { "xData": "body" }, "children": null }] }] }, "script": { "state": { "paragraph": "This is awesome", "body": "The world is wreck" } } };
