const md5 = require('md5')
let clock = 0


module.exports = class Asset {
  constructor(path, type, name) {
    this.path = path
    this.id = clock++
    this.hash = md5(this.id)
    this.name = name
    this.type = type.slice(1)
    this.dependencies = new Set()
    this.depsAssets = new Map()
    this.symbols = new Map()
  }
}
