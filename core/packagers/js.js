const convert = require('../package.js').convert
const write = require('./util').write

module.exports = async function packJs(asset, options) {
    const defer = []
    const cache = []
    asset.output = asset.code
    for (const dep of asset.depsAssets.values()) {
      await convert(dep, options)
      if (dep.tag) {
        defer.push(dep.code)
      } else {
        if (cache.indexOf(dep.name) < 0) {
          asset.output = dep.code + "\n" + asset.output
          cache.push(dep.name)
        }
      }
    }
  
    for (const code of defer) {
      asset.output += "\n" + code
    }
    write(asset)
  }