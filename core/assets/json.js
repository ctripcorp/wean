const Asset = require("./asset")

class JsonAsset extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse(input) {
    this.ast = JSON.parse(input)
    console.log(this.ast)
    for (const key in this.ast) {
      const value = this.ast[key]
      if (key === "pages") {
        for (let i = 0; i < value.length; i++) {
          const path = value[i]
          this.dependencies.add(path + ".page")
        }
        this.dependencies.add("app.js")
      }
      console.log(this.dependencies)
      if (key === "usingComponents") {
        // // 自定义组件，分发到对应的兄弟依赖中
        // for (const tag in value) {
        //   const path = value[tag]
        //   exts
        //     .filter((i) => i !== ".json")
        //     .forEach((e) => {
        //       const sibling = this.refSibling(e.slice(1), this.name)
        //       sibling.dependencies.add({
        //         tag,
        //         path: path + e,
        //         type: e.slice(1),
        //       })
        //     })
        // }
      }
    }
  }
  async generate() {}
}

class PageAsset extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse(input) {
  }
  async generate() {}
}

class ComponentAsset extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse(input) {
  }
  async generate() {}
}

module.exports = {
  Json: JsonAsset,
  Page: PageAsset,
  Component: ComponentAsset,
}
