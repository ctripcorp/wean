const t = require("@babel/types")
const rename = require("./rename")
const { getName } = require("./util")
const treeShake = require("./shake")

module.exports = {
  Program: (path, asset) => {
    treeShake(path.scope)
  },
  FunctionDeclaration: (path, asset) => {
    const name =
      asset.parent.symbols.get(path.node.id.name + asset.name) ||
      getName(asset, "export", path.node.id.name)
      if (name.indexOf('$import') < 0) {
      rename(path.scope, path.node.id.name, name)
      path.replaceWith(path.node)
    }
  },
  VariableDeclaration(path, asset) {
    for (const decl of path.node.declarations) {
      const name =
        asset.parent.symbols.get(decl.id.name + asset.name) ||
        getName(asset, "export", decl.id.name)

      if (name.indexOf('$import') < 0) {
        rename(path.scope, decl.id.name, name)
        path.node.kind = "var"
        path.replaceWith(path.node)
      }
    }
  },
  ExportDefaultDeclaration(path, asset) {
    const init = path.node.declaration
    const name = asset.parent.symbols.get("default" + asset.name)
    path.replaceWith(path.node)
    const newNode = t.VariableDeclaration("var", [
      t.variableDeclarator(t.identifier(name), init),
    ])
    path.replaceWith(newNode)
  },
  ImportDeclaration: (path, asset) => {
    const p = path.node.source.value
    for (let specifier of path.node.specifiers) {
      const localName = specifier.local.name
      const name = getName(asset, "import", localName)
      const prefix =
        specifier.type === "ImportDefaultSpecifier" ? "default" : localName
      asset.symbols.set(prefix + p, name)
      rename(path.scope, localName, name)
    }
    asset.dependencies.add({ path: p, ext: ".js" })
    path.remove()
  },
  ExportNamedDeclaration(path, asset) {
    let { declaration, source, specifiers } = path.node
    if (source) {
    } else if (declaration) {
      if (declaration.type === "FunctionDeclaration") {
        const name =
          asset.parent.symbols.get(declaration.id.name + asset.name) ||
          getName(asset, "export", declaration.id.name)
        rename(path.scope, declaration.id.name, name)
        path.replaceWith(path.node.declaration)
      } else if (declaration.type === "VariableDeclaration") {
        for (const decl of declaration.declarations) {
          const name =
            asset.parent.symbols.get(decl.id.name + asset.name) ||
            getName(asset, "export", decl.id.name)
          rename(path.scope, decl.id.name, name)
          declaration.kind = "var"
          path.replaceWith(declaration)
        }
      }
    } else if (specifiers.length > 0) {
      path.remove()
    }
  },
}
