const babel = require("@babel/core")
const jsx = require("@babel/plugin-transform-react-jsx").default
const Asset = require("./asset")
const { lex, parse, generate } = require("../../wxml/index.js")

module.exports = class Wxml extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse(input) {
    const tokens = lex(input)
    const ast = parse(tokens, this.parent.tag)
    this.ast = ast
  }
  async generate() {
    const { output, imports } = generate(this)
    imports.forEach((i) => this.dependencies.add({ path: i, ext: ".wxml" }))
    // console.log(output)
    const { code } = await babel.transformAsync(output, {
      presets: [],
      plugins: [
        jsx("^7.0", { pragma: "fre.h", pragmaFrag: "fre.Fragment" }, __dirname),
      ],
    })
    this.code = code
  }
}
