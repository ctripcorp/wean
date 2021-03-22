const { manifest } = require("../package.js")
const { random, titleCase } = require("./util")
const Path = require("path")

module.exports = async function packAll(asset,options) {
  const name = `berial-${random()}`
  asset.output.jsx += `
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
  asset.output.jsx = `
    (function({C,directs,wx}, remotes) {
      ${asset.output.jsx}
    })(window,window.remotes);
    `
  const edir = Path.resolve(Path.dirname(options.e))

  const path = asset.path
    .replace(edir, "")
    .replace(/\\/g, "/")
    .replace(".json", "")

  const hash = "/" + asset.hash
  manifest.push({
    name,
    scripts: [hash + ".js", hash + ".jsx"],
    styles: [hash + ".css"],
    path: `${path}`,
  })
  return asset.output.jsx
}
