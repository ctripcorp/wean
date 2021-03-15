const Asset = require("./asset")
const babel = require("@babel/core")
const traverse = require("@babel/traverse").default
const { transformFromAst } = require("@babel/core")
const componentTag = require("../plugins/babel-component-tag")
const hoist = require("../tree-shaking/hoist")

module.exports = class JSAsset extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse(input) {
    this.ast = babel.parse(input)
    traverse(this.ast, hoist, null, this)
  }
  async generate() {
    const { code } = transformFromAst(this.ast, null, {
      presets: [],
      plugins: [[componentTag(), { tag: this.tag }]],
    })
    this.code = code
  }
}
