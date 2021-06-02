const { titleCase } = require("./util")
const esbuild = require('esbuild')

module.exports = async function packWxml(asset, options) {
  const cache = []
  const keys = []
  asset.blockOutput = ''
  const name =
    asset.parent.type === "page"
      ? `const $${asset.parent.id}`
      : `remotes['${titleCase(asset.parent.tag)}']`
  asset.output = `${name} = ${asset.code}\n\n`
  const walk = async (child) => {
    for (const dep of child.childAssets.values()) {
      let blocks = dep.blocks

      for (let key in blocks) {
        let value = blocks[key]
        if (keys.indexOf(key) < 0) {
          keys.push(key)
          asset.blockOutput += value || ''
        } else {
          asset.blockOutput = asset.blockOutput.replace(`$template$${key}$`, value) || ''
        }
      }

      let code = `remotes['${dep.id}'] = ${dep.code}\n\n`
      if (cache.indexOf(dep.path) < 0) {
        asset.output += code
        cache.push(dep.path)
      }
      if (dep.childAssets.size) {
        await walk(dep)
      }
    }
  }
  for (let key in asset.blocks) {
    let value = asset.blocks[key]
    if (keys.indexOf(key) < 0) {
      keys.push(key)
      asset.blockOutput += value
    } else {
      asset.blockOutput = asset.blockOutput.replace(`$template$${key}$`, value) || ''
    }
  }
  walk(asset)
  return asset.blockOutput
}
