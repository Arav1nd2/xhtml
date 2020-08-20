"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var XhtmlComponent = function () {
  function XhtmlComponent() {
    _classCallCheck(this, XhtmlComponent);

    this.lookup = {};
  }
  // Creates a state by wrapping a Proxy on top of the initial state


  _createClass(XhtmlComponent, [{
    key: "createState",
    value: function createState(obj) {
      var _this = this;

      return new Proxy(obj, {
        set: function set(target, property, value) {
          target[property] = value;
          _this.lookup[property].forEach(function (_ref) {
            var el = _ref.el,
                dataAttribute = _ref.dataAttribute;

            el[dataAttribute] = target[property];
          });
          return true;
        }
      });
    }

    // getter function to get the state

  }, {
    key: "getState",
    value: function getState(key) {
      return this.state[key];
    }

    // Adds the state binding element and its data attribute to the lookup

  }, {
    key: "addToLookup",
    value: function addToLookup(binding, stateKey) {
      this.lookup[stateKey] = this.lookup[stateKey] ? [].concat(_toConsumableArray(this.lookup[stateKey]), [binding]) : [binding];
    }
  }, {
    key: "makeHTML",
    value: function makeHTML(dom) {
      var _this2 = this;

      if (dom.type) {
        // Handles all kinds of tags
        // Replace template tags with div tags
        var el = document.createElement(dom.type === "template" ? "div" : dom.type);
        var flag = false;
        Object.keys(dom.attributes).forEach(function (attr) {
          if (attr === "xData") {
            // Add this element to a lookup, which can be used later when the state gets updated
            _this2.addToLookup({ el: el, dataAttribute: "innerText" }, dom.attributes[attr]);
            var val = _this2.getState(dom.attributes[attr]);
            el.innerText = val;
            // Set a flag to prevent this element to build it's child
            flag = true;
          } else if (attr === "xModel") {
            // Add this element to a lookup, which can be used later when the state gets updated
            _this2.addToLookup({ el: el, dataAttribute: "value" }, dom.attributes[attr]);
            el.value = _this2.getState(dom.attributes[attr]);
            // Attach listeners to change the state accordingly
            el.addEventListener("input", function (event) {
              _this2.state[dom.attributes[attr]] = event.target.value;
            });
          } else {
            // Else this a normal HTML attribute, simply append it to the dom
            var attribute = document.createAttribute(attr);
            attribute.value = dom.attributes[attr];
            el.setAttributeNode(attribute);
          }
        });
        // Return the element if it has a xData attribute or if it doesn't have any children
        if (flag || dom.children === null) {
          return el;
        }
        var children = document.createDocumentFragment();
        dom.children.map(function (child) {
          return _this2.makeHTML(child);
        }).forEach(function (childHTML) {
          return children.appendChild(childHTML);
        });
        el.appendChild(children);
        return el;
      } else {
        // This element is a text element
        return document.createTextNode(dom.text);
      }
    }
    // renders dom element to the root;

  }, {
    key: "render",
    value: function render(el) {
      this.state = this.state || this.createState(dom.script.state);
      var res = this.makeHTML(dom.AST);
      el.appendChild(res);
    }
  }]);

  return XhtmlComponent;
}();
"use strict";

var dom = { "AST": { "type": "template", "attributes": {}, "children": [{ "type": "div", "attributes": {}, "children": [{ "type": "h1", "attributes": { "class": "hello", "name": "aravind" }, "children": [{ "text": "This is a template" }] }, { "type": "p", "attributes": { "xData": "paragraph" }, "children": null }, { "type": "input", "attributes": { "name": "hello", "xModel": "paragraph" }, "children": null }, { "type": "input", "attributes": { "name": "world", "xModel": "body" }, "children": null }, { "type": "h3", "attributes": { "xData": "body" }, "children": null }] }] }, "script": { "state": { "paragraph": "This is awesome", "body": "The world is wreck" } } };
