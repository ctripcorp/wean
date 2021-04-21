const Asset = require("./asset")
const MagicString = require("magic-string")
const { parse } = require("acorn")
const analyse = require("../visitors/index")
const jsx = require("../plugins/wean-babel-jsx")

module.exports = class JS extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
    this.modules = new Map()
    this.statements = []
  }
  async parse(input) {
    const code = jsx(input, { tag: this.parent.tag }).transform().code
    this.ast = parse(code, {
      ecmaVersion: 7,
      sourceType: "module",
    })
    analyse(this.ast, new MagicString(code, { filename: asset.path }), this)
    this.statements = this.extendStatements()
  }
  async generate() {
    let magicString = new MagicString.Bundle()
    this.statements.forEach((statement) => {
      const source = statement._source
      if (statement.type === "ExportNamedDeclaration") {
        source.remove(statement.start, statement.declaration.start)
      }
      return magicString.addSource({
        content: source,
        separator: "\n",
      })
    })
    this.code = magicString.toString()
  }
  extendStatements() {
    let allStatements = []
    this.ast.body.forEach((statement) => {
      if (statement.type === "ImportDeclaration") {
        // import 忽略
        return
      }
      let statements = this.expandStatement(statement)
      allStatements.push(...statements)
    })
    return allStatements
  }
  expandStatement(statement) {
    let result = []
    const dependencies = Object.keys(statement._depends)
    this.dependencies.add(...dependencies) // 加入到 asset 的 child 里
    if (!statement._included) {
      statement._included = true
      result.push(statement)
    }
    return result
  }
}
