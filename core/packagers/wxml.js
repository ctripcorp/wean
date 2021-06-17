const { titleCase } = require("./util")
const esbuild = require('esbuild')

module.exports = async function packWxml(asset) {
  const walk = async (child) => {
    for (const dep of child.childAssets.values()) {
      wiredBlock(dep.blocks, asset)
      if (dep.childAssets.size) {
        await walk(dep)
      }
    }
  }
  asset.output = ''
  wiredBlock(asset.blocks, asset)
  walk(asset)
  const pre = asset.parent.type === "page" ? `const $${asset.parent.id} = (props) => {
    const [state, setState] = fre.useState(props.data)
    fre.useEffect(()=>{
      window.components[${asset.parent.id}] = (data) => setState(data)
      $ready(${asset.parent.id})
    },[])
    with(state){
      return <div>${asset.output}</div>
    }
  }\n`: `remotes['${titleCase(asset.parent.tag)}'] = (props) =>{
    const [state, setState] = fre.useState({})
    fre.useEffect(()=>{
      window.components[${asset.parent.id}] = (data) => setState(data)
      $ready(${asset.parent.id})
    },[])
    with({...props,...state}){
      return <div>${asset.output}</div>
    }
  }`

  const { code } = await esbuild.transform(pre, {
    jsxFactory: 'fre.h',
    jsxFragment: 'fre.Fragment',
    loader: 'jsx',
  })
  return code
}

function wiredBlock(blocks, asset) {
  for (let key in blocks) {
    let value = blocks[key]
    if (isNaN(+key)) {
      asset.output = asset.output
        .replace(`$template$${key}$`, value)
        .replace(`$slot$${key}$`, value) || ''
    } else {
      asset.output += value
    }
  }
}