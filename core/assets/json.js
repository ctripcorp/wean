const Asset = require("./asset")

class AppAsset extends Asset {
  // app.json
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
          this.dependencies.add({ path, ext: ".page" })
        }
      }
      if (key === "usingComponents") {
        // toto 公共组件
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
    this.ast = JSON.parse(input)
    for (const key in this.ast) {
      const value = this.ast[key]
      if (key === "usingComponents") {
        for (const k in value) {
          const v = value[k]
          this.dependencies.add({ path: v, tag: k, ext: ".component" })
        }
      }
    }
  }
  async generate() {}
}

class ComponentAsset extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse(input) {
    this.ast = JSON.parse(input)
    for (const key in this.ast) {
      const value = this.ast[key]
      if (key === "usingComponents") {
        for (const k in value) {
          const v = value[k]
          this.dependencies.add({ path: v, tag: k, type: ".component" })
        }
      }
    }
  }
  async generate() {}
}

module.exports = {
  App: AppAsset,
  Page: PageAsset,
  Component: ComponentAsset,
}
