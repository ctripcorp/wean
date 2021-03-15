const { convert, manifest } = require("../package.js")
const { write, random, titleCase } = require("./util")
const Path = require("path")

module.exports = async function packWxml(asset, options) {
  const cache = []
  let output = `const $${asset.id} = ${asset.code}\n\n`
  for (const dep of asset.depsAssets.values()) {
    await convert(dep, options)
    let code = `remotes['${dep.tag ? titleCase(dep.tag) : dep.id}'] = ${dep.code
      }\n\n`
    if (cache.indexOf(dep.name) < 0) {
      output += code
      cache.push(dep.name)
    }
  }
  const name = `berial-${random()}`
  output += `
    window['${name}'] = {
      async bootstrap({host}){
        const div = document.createElement('div');
        div.id = "root";
        host.appendChild(div)
      },
      async mount({host}){
        window.remotes.host = host;
        fre.render(fre.h('div',{},fre.h($${asset.id})),host.getElementById("root"));
      },
      async unmount({host}){
        host.getElementById("root").innerHTML = ""
      }
    }
    `
  asset.output = `
    (function({C,directs,wx}, remotes) {
      ${output}
    })(window,window.remotes);
    `
  const edir = Path.resolve(Path.dirname(options.e))

  const path = asset.path.replace(edir, "").replace(/\\/g, "/").replace('.wxml', "")

  const hash = '/' + asset.parent.hash
  manifest.push({
    name,
    scripts: [hash + '.js', hash + '.jsx'],
    styles: [hash + '.css'],
    path: `${path}`,
  })
  await write(asset)
}
