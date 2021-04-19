const Asset = require("./asset")
const MagicString = require("magic-string")
var jsx = require("acorn-jsx")
const { Parser } = require("acorn")
const analyse = require("../visitors/index")

module.exports = class JS extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
    this.modules = new Map()
    this.statements = []
  }
  async parse(input) {
    this.ast = Parser.extend(jsx()).parse(input, {
      ecmaVersion: 7,
      sourceType: "module",
    })
    const code = new MagicString(input, { filename: asset.path })
    analyse(this.ast, code, this)
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
