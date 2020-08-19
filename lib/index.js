let dom = somthing;

function makeHTML(dom) {
  return "HTML";
}

function render(el) {
  el.appendChild(makeHTML(el));
}
