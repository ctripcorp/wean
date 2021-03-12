const write = require('./util').write


module.exports = async function packWxss(asset, options) {
  asset.output = asset.code
  for (const dep of asset.depsAssets.values()) {
    asset.output = dep.code + "\n" + asset.output || ""
  }
  await write(asset)
}
