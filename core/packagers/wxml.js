const { convert, manifest } = require("../package.js")
const util = require("./util")
const Path = require("path")

module.exports = async function packWxml(asset, options) {
  const cache = []
  let output = `const $${asset.id} = ${asset.code}\n\n`
  for (const dep of asset.depsAssets.values()) {
    await convert(dep, options, true, asset.outputPath)
    let code = `remotes['${dep.tag ? util.titleCase(dep.tag) : dep.id}'] = ${
      dep.code
    }\n\n`
    if (cache.indexOf(dep.name) < 0) {
      output += code
      cache.push(dep.name)
    }
  }
  const name = `berial-${util.random()}`
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
  const path = asset.outputPath
    .replace(Path.resolve(options.outputPath), "")
    .replace(/\\/g, "/")

  manifest.push({
    name,
    scripts: [path.replace("wxml", "js"), path.replace("wxml", "jsx")],
    styles: [path.replace("wxml", "css")],
    path: `${path.replace(".wxml", "")}`,
  })
  await util.write(asset)
}
