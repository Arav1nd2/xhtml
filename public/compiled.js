"use strict";

function makeHTML(dom) {
  if (dom.type) {
    var el = document.createElement(dom.type === "template" ? "div" : dom.type);
    Object.keys(dom.attributes).forEach(function (attr) {
      var attribute = document.createAttribute(attr);
      attribute.value = dom.attributes[attr];
      el.setAttributeNode(attribute);
    });
    var children = document.createDocumentFragment();
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
}

function render(el) {
  // let res = parseFile(file);
  // console.log(res);
  var res = makeHTML(dom.AST);
  console.log(res);
  el.appendChild(res);
}
"use strict";

var dom = { "AST": { "type": "template", "attributes": {}, "children": [{ "type": "h1", "attributes": { "class": "hello", "name": "aravind" }, "children": [{ "text": "This is a template" }] }, { "type": "p", "attributes": { "xData": "Thsi is a paragraph" }, "children": [{ "text": "This is a paragraph" }] }] }, "script": "<script>\n  var a = 2;\n  console.log(a);\n</script>" };
