const md5 = require('md5')
let clock = 0

const exts = {
  '.js': '.js',
  '.wxml': '.jsx',
  '.wxss': '.css',
}

module.exports = class Asset {
  constructor(path, type, name,tag) {
    this.path = path
    this.tag = tag
    this.id = clock++
    this.hash = md5(this.id)
    this.name = name
    this.ext = exts[type]
    this.type = type.slice(1)
    this.dependencies = new Set()
    this.childAssets = new Map()
    this.siblingAssets = new Map() // 0 wxml 1 js 2 wxss
    this.output = {}
    this.symbols = new Map()
  }
}
