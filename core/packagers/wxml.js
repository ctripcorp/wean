const { titleCase } = require("./util")
const esbuild = require('esbuild')

module.exports = async function packWxml(asset) {
  const keys = []

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
  const pre = asset.parent.type === "page" ? `const $${asset.parent.id} = (props) => {
    const {data} = useSharedData(['${asset.parent.id}'])
    with(data){
      return <>${asset.output}</>
    }
  }\n`: `remotes['${titleCase(asset.parent.tag)}'] = (props) =>{
    const {data, properties} = useSharedData(['${asset.parent.id}'])
    with(properties){
      with(data){
        return <>${asset.output}</>
      }
    }
  }`

  const { code } = await esbuild.transform(pre, {
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
      asset.output += value
    } else {
      asset.output = asset.output.replace(`$template$${key}$`, value) || ''
    }
  }
}