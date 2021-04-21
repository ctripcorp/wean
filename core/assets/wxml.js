const Asset = require("./asset")
const { lex, parse, generate } = require("../../wxml/index.js")
const babel = require("@babel/core")
const jsx = require("../plugins/wean-babel-jsx")

module.exports = class Wxml extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse(input) {
    const tokens = lex(input)
    const ast = parse(tokens)
    this.ast = ast
  }
  async generate() {
    const { hook, code: newCode, imports } = generate(this)
    imports.forEach((i) => this.dependencies.add({ path: i, ext: ".wxml" }))
    const code = jsx.transform(input, { tag: this.parent.tag }).code

    this.code = `(props)=>{
      ${hook}
      with(data){
        return ${code}
      }
    }`
  }
}
