const Asset = require("./asset")
const postcss = require("postcss")
const postcssTagReplacer = require("../plugins/postcss-tag-replacer")
const postcssRpx2rem = require("../plugins/postcss-rpx2rem")


module.exports = class Wxss extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }

  addDep() {
    let that = this
    return {
      postcssPlugin: "postcss-add-dep",
      AtRule(node) {
        if (node.name === "import") {
          const dep = { path: node.params.replace(/"/g, ""), ext: ".wxss" }
          that.dependencies.add(dep)
          node.type = "comment"
          node.text = JSON.stringify(dep)
        }
      },
    }
  }

  async transform(input) {
    // const wxml = this.parent.siblingAssets.get(".wxml")
    // const id = wxml ? `data-w-${wxml.hash.slice(0, 6)}` : null
    // const scoped = false

    this.code = postcss([
      postcssTagReplacer({
        // css 需要替换的标签
        replaceMap: {
          view: "div",
          icon: "i",
          text: "span",
          navigator: "a",
          image: "img",
          page: "#root",
        },
      }),
      this.addDep(),
      // postcssSopedCss({
      //   id,
      // }),
      postcssRpx2rem(),
    ]).process(input).css
  }
}
