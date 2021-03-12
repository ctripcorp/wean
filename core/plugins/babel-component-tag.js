/*
  input:
  Component({...})
  output:
  Component({...}, tagname)
*/

const t = require("@babel/types")

module.exports = function (babel) {
  return {
    visitor: {
      CallExpression: function CallExpression(path, state) {
        const callee = path.node.callee
        const arguments = path.node.arguments
        if (callee.name === "Component") {
          if (arguments.length <= 1) {
            arguments.push(t.stringLiteral(state.opts.tag))
            path.replaceWith(t.callExpression(callee, arguments))
          }
        }
      },
    },
  }
}
