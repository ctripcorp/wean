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
  asset.out = ''
  wiredBlock(asset.blocks, asset)
  walk(asset)
  const pre = asset.parent.type === "page" ? `const $${asset.parent.id} = (props) => {
    const [state, setState] = fre.useState(props.data)
    fre.useEffect(()=>{
      window.components[${asset.parent.id}] = (data) => setState(data)
      $mount(${asset.parent.id})
      return () => $unmount(${asset.parent.id})
    },[])
    with(state){
      return <>${asset.out}</>
    }
  }\n`: `remotes['${titleCase(asset.parent.tag)}'] = (props) =>{
    const [state, setState] = fre.useState({})
    fre.useEffect(()=>{
      window.components[${asset.parent.id}] = (data) => setState(data)
      $mount(${asset.parent.id})
      return () => $unmount(${asset.parent.id})
    },[])
    with({...props,...state}){
      return <>${asset.out}</>
    }
  }`
  try {
    var { code } = await esbuild.transform(pre, {
      jsxFactory: 'fre.h',
      jsxFragment: 'fre.Fragment',
      loader: 'jsx',
    })
  } catch (e) {
  }

  return code
}

function wiredBlock(blocks, asset) {
  for (let key in blocks) {
    let value = blocks[key]
    if (isNaN(+key)) {
      asset.out = asset.out
        .replace(`$template$${key}$`, value)
        .replace(`$slot$${key}$`, value) || ''
    } else {
      asset.out += value
    }
  }
}