const Asset = require("./asset")
const MagicString = require("magic-string")
const { parse } = require("acorn")
const analyse = require("../visitors/index")

module.exports = class JS extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
    this.modules = new Map()
    this.statements = []
    this.exports = {}
  }
  async parse(input) {
    this.ast = parse(input, {
      ecmaVersion: 7,
      sourceType: "module",
    })
    analyse(this.ast, new MagicString(input, { filename: this.path })) // 构建作用域链，分析全局变量
    this.ast.body.forEach((node) => {
      if (node.type === "ImportDeclaration") {
        let path = node.source.value
        let specifiers = node.specifiers
        specifiers.forEach((spec) => {
          let localname = spec.local.name
          this.dependencies.add({ name: localname, path, ext: ".js" })
        })
      } else if (node.type === "ExportNamedDeclaration") {
        let decl = node.declaration
        if (decl.type === "VariableDeclaration") {
          let name = decl.declarations[0].id.name
          this.exports[name] = { node, localname: name, desl } // 暂时没用
        }
      }
    })
    this.statements = this.extendStatements()
  }
  async generate() {
    let magicString = new MagicString.Bundle()
    this.statements.forEach((statement) => {
      const source = statement._source
      console.log(source.toString())
      return magicString.addSource({
        content: source,
        separator: "\n",
      })
    })
    this.code = magicString.toString()
  }
  extendStatements() {
    let allStatements = []
    const ignoreTypes = [
      "ExportDefaultDeclaration",
      "ImportDeclaration",
      "ExportNamedDeclaration",
    ]
    this.ast.body.forEach((statement) => {
      if (ignoreTypes.includes(statement.type)) {
        return
      }
      let statements = this.expandStatement(statement)
      allStatements.push(...statements)
    })
    return allStatements
  }
  expandStatement(statement) {
    let result = []
    if (!statement._included) {
      statement._included = true
      result.push(statement)
    }
    return result
  }
}
