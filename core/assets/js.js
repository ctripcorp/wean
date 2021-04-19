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
    this.statements = extendStatements()
  }
  async generate() {
    let magicString = new MagicString.Bundle()
    this.statements.forEach((statement) =>
      magicString.addSource({
        content: statement.source,
        separator: "\n",
      })
    )
    this.code = magicString.toString()
    console.log(this.code)
  }
  extendStatements() {
    let allStatements = []
    this.ast.body.forEach((statement) => {
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
