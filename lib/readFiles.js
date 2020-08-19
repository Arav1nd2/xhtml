const fs = require("fs");
const generateAST = require("./parser/index");

let regex = /(<template>((.|\n)*)<\/template>)?(<script>((.|\n)*)<\/script>)?/g;

let path = `${process.cwd()}/src/App.xhtml`;
console.log(path);

fs.readFile(path, "utf8", (err, data) => {
  if (err) {
    throw err;
  }
  const result = data.match(regex).filter((match) => match.length > 0);
  let templateString, scriptString;
  if (/(<template>((.|\n)*)<\/template>)/g.test(result[0])) {
    templateString = result[0];
    if (result.length > 1 && /(<script>((.|\n)*)<\/script>)/.test(result[1])) {
      scriptString = result[1];
    }
  } else if (/(<script>((.|\n)*)<\/script>)/.test(result[0])) {
    scriptString = result[0];
  }
  console.log({ templateString, scriptString });
  console.log("Generating AST......");
  try {
    let ast = generateAST(templateString);
    console.log("AST", JSON.stringify(ast, 5));
  } catch (err) {
    console.log("Error, %s", err);
  }
});

function buildHTML(ast) {
  if (ast[type] === undefined) {
    return ast.text;
  }
  let node = document.createElement(ast[type]);
  Object.keys(ast.attributes).forEach((name) => {
    let attribute = document.createAttribute(name);
    attribute.value = ast.attribute[name];
    node.setAttributeNode = attribute;
  });
  let innerHTML = document.createDocumentFragment();
  ast.children.forEach((child) => {
    innerHTML.appendChild(buildHTML(child));
  });
  node.appendChild(innerHTML);
  return node;
}
