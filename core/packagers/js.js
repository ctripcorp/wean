const { minify } = require("terser")

module.exports = async function packJs(asset, options) {
  const defer = []
  const cache = []
  asset.output = asset.code
  const walk = async (child) => {
    for (const dep of child.childAssets.values()) {
      if (dep.tag) {
        defer.push(dep.code)
      } else {
        if (cache.indexOf(dep.path) < 0) {
          asset.output = dep.code + "\n" + asset.output
          cache.push(dep.path)
        }
      }
      if (dep.childAssets.size) {
        await walk(dep)
      }
    }

    for (const code of defer) {
      asset.output += "\n" + code
    }
  }
  walk(asset)
  return asset.output + "\n\n"
}
