const Asset = require("./asset")
const { lex, parse, generate } = require("../../wxml/index.js")

module.exports = class Wxml extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async transform(input) {
    const tokens = lex(input)
    const ast = parse(tokens)
    this.ast = ast
    let { imports, blocks } = generate(this)
    this.blocks = blocks
    imports.forEach((i) => this.dependencies.add({ path: i, ext: ".wxml" }))
  }
}
