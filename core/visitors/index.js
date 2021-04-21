const Scope = require("./scope")
const traverse = require("./traverse")

function analyse(ast, magicString, module) {
  let scope = new Scope()

  ast.body.forEach((statement) => {
    const addToScope = (declaration) => {
      let name = declaration.id.name
      scope.add(name)
      if (!scope.parent) {
        statement._defines[name] = true
      }
    }

    statement._source = magicString.snip(statement.start, statement.end)
    statement._defines = {}
    statement._includes = {}
    statement._depends = {}

    traverse(statement, {
      enter(node) {
        let newScope
        switch (node.type) {
          case "FunctionDeclaration":
            const params = node.params.map((p) => p.name)
            addToScope(node)
            newScope = new Scope({
              parent: scope,
              params,
            })
            break
          case "VariableDeclaration":
            node.declarations.forEach(addToScope)
            break
          default:
            break
        }
        if (newScope) {
          node._scope = newScope
          scope = newScope
        }
      },
      lerve(node) {
        if (node._scope) {
          scope = scope.parent
        }
      },
    })
  })
}
module.exports = analyse
