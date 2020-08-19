const fs = require("fs");
const generateAST = require("./parser/index");

let regex = /(<template>((.|\n)*)<\/template>)?(<script>((.|\n)*)<\/script>)?/g;

let path = `${process.cwd()}/src/App.xhtml`;

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
  try {
    let ast = generateAST(templateString);
    console.log(
      `let dom = ${JSON.stringify({
        AST: ast,
        script: scriptString,
      })}`
    );
  } catch (err) {
    throw new Error(err);
  }
});
