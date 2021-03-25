const { minify } = require("terser")

module.exports = async function packJs(asset, options) {
  const defer = []
  const cache = []
  asset.output = asset.code
  for (const dep of asset.childAssets.values()) {
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
  return asset.output + "\n\n"
}
