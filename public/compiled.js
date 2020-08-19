"use strict";

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dom = null;

var path = process.cwd + "/src/App.xhtml";

console.log(path);

function render(el) {
  el.appendChild(dom);
}
