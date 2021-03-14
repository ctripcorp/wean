const Asset = require("./asset")
const postcss = require("postcss")
const postcssTagReplacer = require("../plugins/postcss-tag-replacer")
const postcssRpx2rem = require("../plugins/postcss-rpx2rem")
const postcssSopedCss = require('../plugins/postcss-scoped-css')

module.exports = class WxssAsset extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse(input) {
    this.input = input
  }
  async generate() {
    this.code = postcss([
      postcssTagReplacer({
        // css 需要替换的标签
        replaceMap: {
          view: "div",
          icon: "i",
          text: "span",
          navigator: "a",
          image: "img",
        },
      }),
      postcssSopedCss({
        id: this.hash
      }),
      postcssRpx2rem(),
    ]).process(this.input).css
  }
}
