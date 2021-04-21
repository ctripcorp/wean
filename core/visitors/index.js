const Scope = require("./scope")
const traverse = require("./traverse")

function analyse(ast, magicString, module) {
  let scope = new Scope({
    name: "global",
  })

  ast.body.forEach((statement) => {
    const addToScope = (declaration) => {
      let name = declaration.id.name
      scope.add(name)
      if (!scope.parent) { // 全局定义的变量
        statement._defines[name] = true
      }
    }

    statement._source = magicString.snip(statement.start, statement.end)
    statement._defines = {}
    statement._includes = {}
    statement._depends = {}

    traverse(statement, {
      enter(node) {
        switch (node.type) {
          case "FunctionDeclaration":
            const params = node.params.map((p) => p.name)
            const name = node.id.name
            addToScope(node)
            scope = new Scope({
              name,
              parent: scope,
              params,
            })
            console.log(scope)
            node._scope = scope
            break
          case "VariableDeclaration":
            node.declarations.forEach(addToScope)
            break

          default:
            break
        }
      },
      leave(node) {
        if (node._scope) {
          scope = scope.parent
        }
      },
    })
  })

  ast._scope = scope

  ast.body.forEach((statement) => {
    traverse(statement, {
      enter(node) {
        if (node._scope) {
          scope = node._scope
        }
        if (node.type === "Identifier") {
          const defineScope = scope.findScope(node.name)
          if (!defineScope) { // 找不到作用域的变量
            statement._depends[node.name] = true
          }
        }
      },
      leave(node) {
        if (node._scope) {
          scope = scope.parent
        }
      },
    })
  })
}
module.exports = analyse
