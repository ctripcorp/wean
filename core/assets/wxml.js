const Asset = require("./asset")
const { lex, parse, generate } = require("../../wxml/index.js")
const babel = require("@babel/core")
const jsx = require("@babel/plugin-transform-react-jsx").default

module.exports = class WxmlAsset extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse(input) {
    const tokens = lex(input)
    const ast = parse(tokens, this.tag)
    this.ast = ast
  }
  async generate() {
    const { output, imports } = generate(this)
    imports.forEach((i) => this.dependencies.add({ path: i, type: 'wxml' }))
    const { code } = await babel.transformAsync(output, {
      presets: [],
      plugins: [
        jsx("^7.0", { pragma: "fre.h", pragmaFrag: "fre.Fragment" }, __dirname),
      ],
    })
    this.code = code
  }
}
