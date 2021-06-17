module.exports = async function packJs(asset, options) {
  const defer = []
  const cache = []
  asset.out = asset.code
  const walk = async (child) => {
    for (const dep of child.childAssets.values()) {
      if (dep.tag) {
        defer.push(dep.code)
      } else {
        if (cache.indexOf(dep.path) < 0) {
          asset.out = dep.code + "\n" + asset.out
          cache.push(dep.path)
        }
      }
      if (dep.childAssets.size) {
        await walk(dep)
      }
    }


    for (const code of defer) {
      asset.out += "\n" + code
    }
  }
  walk(asset)
  return asset.out + "\n\n"
}
