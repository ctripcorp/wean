const write = require('./util').write


module.exports = async function packWxss(asset, options) {
  asset.output = asset.code
  for (const dep of asset.childAssets.values()) {
    asset.output = dep.code + "\n" + asset.output || ""
  }
  await write(asset)
}
