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
        id: `data-w-${wxml ? wxml.hash.slice(0, 6) : ''}`,
      }),
      postcssRpx2rem(),
    ]).process(this.input).css
  }
  getWxml(asset) {
    if (asset.parent.type === 'json') {
      const dep = Array.from(asset.parent.dependencies).find(d => d.type === 'wxml')
      return asset.parent.depsAssets.get(dep)
    } else {
      let p = asset.parent
      let i = 0
      while (p.type !== 'json') {
        p = p.parent
        i++
      }
      let a = p
      while (i > 0) {
        const pw = Array.from(a.dependencies).find(d => d.type === 'wxml')
        a = a.depsAssets.get(pw)
        i--
      }
      const o = Array.from(a.dependencies).find(d => d.tag === asset.tag)
      return a.depsAssets.get(o)
    }
  }
}
