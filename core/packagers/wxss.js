module.exports = async function packWxss(asset, options) {
  let cache = []
  asset.output = asset.code
  const walk = async (child) => {
    for (const dep of child.childAssets.values()) {
      if (cache.indexOf(dep.path) < 0) {
        asset.output = dep.code + "\n" + asset.output
        cache.push(dep.path)
      }
      if (dep.childAssets.size) {
        await walk(dep)
      }
    }
  }
  await walk(asset)

  return asset.output
}
