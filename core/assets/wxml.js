const Asset = require("./asset")
const { lex, parse, generate } = require("../../wxml/index.js")

const esbuild = require('esbuild')

let output = ''
let keys = []

module.exports = class Wxml extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async transform(input) {
    const tokens = lex(input)
    const ast = parse(tokens)
    this.ast = ast
    let { hook, code, imports, blocks } = generate(this)

    code  = this.esbuildTransform(code)

    for (let key in blocks) {
      let value = blocks[key]
      if (keys.indexOf(key) < 0) {
        keys.push(key)
        output += value
      } else {
        output = output.replace(`$template$${key}$`, value)
      }
    }
    console.log(output)
    imports.forEach((i) => this.dependencies.add({ path: i, ext: ".wxml" }))

    this.code = `(props)=>{
      ${hook}
      with(data){
        return ${code}
      }
    }`
  }
  esbuildTransform(input){
    const { code } = esbuild.transformSync(input + '', {
      jsxFactory: 'fre.h',
      jsxFragment: 'fre.Fragment',
      loader: 'jsx',
    })
    return code
  }
}
