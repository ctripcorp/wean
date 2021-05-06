const Asset = require("./asset")
const MagicString = require("magic-string")
const { parse } = require("acorn")
const analyse = require("../visitors/index")

module.exports = class JS extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
    this.statements = []
  }
  async parse(input) {
    this.ast = parse(input, {
      ecmaVersion: 7,
      sourceType: "module",
    })
    analyse(this.ast, new MagicString(input, { filename: this.path })) // 构建作用域链，分析全局变量
    this.statements = this.extendStatements()
  }
  async generate() {
    let magicString = new MagicString.Bundle()
    this.statements.forEach((statement) => {
      const source = statement._source
      if (source) {
        magicString.addSource({
          content: source,
          separator: "\n",
        })
      }
    })
    this.code = magicString.toString()
  }
  extendStatements() {
    let statements = []
    this.ast.body.forEach((statement) => {
      if (statement.type === "ImportDeclaration") {
        let path = statement.source.value
        let specifiers = statement.specifiers
        specifiers.forEach((spec) => {
          let name = spec.local.name
          this.dependencies.add({ name, path, ext: ".js" })
        })
        return
      } else if (statement.type === "ExportNamedDeclaration") {
        statements.push(statement.declaration)
      } else {
        statements.push(statement)
      }
    })
    return statements
  }
}
