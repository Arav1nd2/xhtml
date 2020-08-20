class XhtmlComponent {
  constructor() {
    this.lookup = {};
  }
  // Creates a state by wrapping a Proxy on top of the initial state
  createState(obj) {
    return new Proxy(obj, {
      set: (target, property, value) => {
        target[property] = value;
        this.lookup[property].forEach(({ el, dataAttribute }) => {
          el[dataAttribute] = target[property];
        });
        return true;
      },
    });
  }

  // getter function to get the state
  getState(key) {
    return this.state[key];
  }

  // Adds the state binding element and its data attribute to the lookup
  addToLookup(binding, stateKey) {
    this.lookup[stateKey] = this.lookup[stateKey]
      ? [...this.lookup[stateKey], binding]
      : [binding];
  }

  makeHTML(dom) {
    if (dom.type) {
      // Handles all kinds of tags
      // Replace template tags with div tags
      let el = document.createElement(
        dom.type === "template" ? "div" : dom.type
      );
      let flag = false;
      Object.keys(dom.attributes).forEach((attr) => {
        if (attr === "xData") {
          // Add this element to a lookup, which can be used later when the state gets updated
          this.addToLookup(
            { el, dataAttribute: "innerText" },
            dom.attributes[attr]
          );
          let val = this.getState(dom.attributes[attr]);
          el.innerText = val;
          // Set a flag to prevent this element to build it's child
          flag = true;
        } else if (attr === "xModel") {
          // Add this element to a lookup, which can be used later when the state gets updated
          this.addToLookup(
            { el, dataAttribute: "value" },
            dom.attributes[attr]
          );
          el.value = this.getState(dom.attributes[attr]);
          // Attach listeners to change the state accordingly
          el.addEventListener("input", (event) => {
            this.state[dom.attributes[attr]] = event.target.value;
          });
        } else {
          // Else this a normal HTML attribute, simply append it to the dom
          let attribute = document.createAttribute(attr);
          attribute.value = dom.attributes[attr];
          el.setAttributeNode(attribute);
        }
      });
      // Return the element if it has a xData attribute or if it doesn't have any children
      if (flag || dom.children === null) {
        return el;
      }
      let children = document.createDocumentFragment();
      dom.children
        .map((child) => this.makeHTML(child))
        .forEach((childHTML) => children.appendChild(childHTML));
      el.appendChild(children);
      return el;
    } else {
      // This element is a text element
      return document.createTextNode(dom.text);
    }
  }
  // renders dom element to the root;
  render(el) {
    this.state = this.state || this.createState(dom.script.state);
    const res = this.makeHTML(dom.AST);
    el.appendChild(res);
  }
}
