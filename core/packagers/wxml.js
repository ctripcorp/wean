const {titleCase } = require("./util")

module.exports = async function packWxml(asset, options) {
  const cache = []
  const name =
    asset.parent.type === "page"
      ? `const $${asset.id}`
      : `remotes['${titleCase(asset.parent.tag)}']`
  asset.output = `${name} = ${asset.code}\n\n`
  for (const dep of asset.childAssets.values()) {
    let code = `remotes['${dep.id}'] = ${dep.code}\n\n`
    if (cache.indexOf(dep.name) < 0) {
      asset.output += code
      cache.push(dep.name)
    }
  }
  return asset.output
}
