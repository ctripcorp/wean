const Asset = require("./asset")
const postcss = require("postcss")
const postcssTagReplacer = require("../plugins/postcss-tag-replacer")
const postcssRpx2rem = require("../plugins/postcss-rpx2rem")
const postcssSopedCss = require('../plugins/postcss-scoped-css')
const Path = require('path')

module.exports = class WxssAsset extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse(input) {
    this.input = input
  }
  async generate() {
    const wxml = this.getWxml(this)
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
        id: `data-w-${wxml.hash}`
      }),
      postcssRpx2rem(),
    ]).process(this.input).css
  }
  getWxml(asset, dep) {
    if (asset.parent.type === 'json') {
      const dep = Array.from(asset.parent.dependencies).find(d => d.type === 'wxml')
      return asset.parent.depsAssets.get(dep)
    } else {
      return asset
    }
  }
}
