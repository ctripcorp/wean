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

  const walk = async (child) => {
    for (const dep of child.childAssets.values()) {
      wiredBlock(dep.blocks, keys, asset)
      if (dep.childAssets.size) {
        await walk(dep)
      }
    }
  }

  wiredBlock(asset.blocks, keys, asset)
  walk(asset)
  const pre = `${name} = (props) => {
    return <>${asset.blockOutput}</>
  }\n`

  const { code } = esbuild.transformSync(pre, {
    jsxFactory: 'fre.h',
    jsxFragment: 'fre.Fragment',
    loader: 'jsx',
  })
  return code
}

function wiredBlock(blocks, keys, asset) {
  for (let key in blocks) {
    let value = blocks[key]
    if (keys.indexOf(key) < 0) {
      keys.push(key)
      asset.blockOutput += value
    } else {
      asset.blockOutput = asset.blockOutput.replace(`$template$${key}$`, value) || ''
    }
  }
}