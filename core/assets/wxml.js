const Asset = require("./asset")
const { lex, parse, generate } = require("../../wxml/index.js")
const babel = require("@babel/core")
const jsx = require("@babel/plugin-transform-react-jsx").default

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
    const { code } = await babel.transformAsync(newCode, {
      presets: [],
      plugins: [
        jsx("^7.0", { pragma: "fre.h", pragmaFrag: "fre.Fragment" }, __dirname),
      ],
    })

    this.code = `(props)=>{
      ${hook}
      with(data){
        return ${code}
      }
    }`
  }
}
