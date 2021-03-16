const Asset = require("./asset")
const Path = require("path")

const exts = [".json", ".js", ".wxml", ".wxss"]
module.exports = class JsonAsset extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse(input) {
    this.ast = JSON.parse(input)
    for (const key in this.ast) {
      const value = this.ast[key]
      if (key === "pages") {
        for (let i = 0; i < value.length; i++) {
          const path = value[i]
          exts.forEach((e) =>
            this.dependencies.add({ path: path + e, type: e.slice(1) })
          )
        }
        this.dependencies.add({
          path: "app.js",
          type: "js",
        })
      }
      if (key === "usingComponents") {
        // 自定义组件，分发到对应的兄弟依赖中
        for (const tag in value) {
          const path = value[tag]
          exts
            .filter((i) => i !== ".json")
            .forEach((e) => {
              const sibling = this.refSibling(e.slice(1), this.name)
              sibling.dependencies.add({
                tag,
                path: path + e,
                type: e.slice(1)
              })
            })
        }
      }
    }
  }
  async generate() { }
  refSibling(type, path) {
    for (const dep of this.parent.dependencies) {
      if (Path.dirname(dep.path) === Path.dirname(path)) {
        if (dep.type === type) {
          return this.parent.depsAssets.get(dep)
        }
      }

    }
  }
}
