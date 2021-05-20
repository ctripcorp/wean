const Asset = require("./asset")
const { lex, parse, generate } = require("../../wxml/index.js")

const esbuild = require('esbuild')


module.exports = class Wxml extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async transform(input) {
    const tokens = lex(input)
    const ast = parse(tokens)
    this.ast = ast
    const { hook, code: newCode, imports } = generate(this)
    imports.forEach((i) => this.dependencies.add({ path: i, ext: ".wxml" }))

    const { code } = esbuild.transformSync(newCode, {
      jsxFactory: 'fre.h',
      jsxFragment: 'fre.Fragment',
      loader: 'jsx',
    })

    this.code = `(props)=>{
      ${hook}
      with(data){
        return ${code}
      }
    }`
  }
}
