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
  asset.output = ''
  wiredBlock(asset.blocks, keys, asset)
  walk(asset)
  const pre = asset.parent.type === "page" ? `const $${asset.parent.id} = (props) => {
    const {data} = props
    with(data){
      return <div>${asset.output}</div>
    }
  }\n`: `remotes['${titleCase(asset.parent.tag)}'] = (props) =>{
    const {data, properties} = useComponent(['${asset.parent.id}'])
    with(properties){
      with(data){
        return <div>${asset.output}</div>
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