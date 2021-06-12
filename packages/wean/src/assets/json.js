const Asset = require('./asset')

class App extends Asset {
  // app.json
  constructor(path, type, name) {
    super(path, type, name)
  }
  async transform(input) {
    this.ast = JSON.parse(input)
    for (const key in this.ast) {
      const value = this.ast[key]
      if (key === 'pages') {
        for (let i = 0; i < value.length; i++) {
          const path = value[i]
          this.dependencies.add({ path, ext: '.page' })
        }
      }
      if (key === 'usingComponents') {
        // toto 公共组件
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
      if (key === 'usingComponents') {
        for (const k in value) {
          const v = value[k]
          this.dependencies.add({ path: v, tag: k, ext: '.component' })
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
      if (key === 'usingComponents') {
        for (const k in value) {
          const v = value[k]
          this.dependencies.add({ path: v, tag: k, type: '.component' })
        }
      }
    }
  }
}

module.exports = {
  App: App,
  Page: Page,
  Component: Component
}
