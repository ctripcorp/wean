const Asset = require("./asset")
const fs = require('fs')
const path = require('path')

class App extends Asset {
  // app.json
  constructor(path, type, name) {
    super(path, type, name)
  }
  async transform(input) {
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
      if (key === 'tabBar') {
        // tabbar 只需要处理附件，不需要实现
        value.list.forEach(item => {
          item.iconPath = path.join(path.dirname(this.path), item.iconPath)
          item.selectedIconPath = path.join(path.dirname(this.path), item.selectedIconPath)
        })
      }
    }
  }
}

class Page extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async transform(input) {
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
}

class Component extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async transform(input) {
    this.ast = JSON.parse(input)
    for (const key in this.ast) {
      const value = this.ast[key]
      if (key === "usingComponents") {
        for (const k in value) {
          const v = value[k]
          this.dependencies.add({ path: v, tag: k, type: ".component", ext: ".component" })
        }
      }
    }
  }
}

module.exports = {
  App: App,
  Page: Page,
  Component: Component,
}
