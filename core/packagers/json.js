const convert = require('../package.js').convert
const Path = require('path')

module.exports = async function packJson(asset, options) {
    for (const dep of asset.depsAssets.values()) {
      convert(
        dep,
        options
      )
    }
  }