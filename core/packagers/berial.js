const { manifest } = require("../package.js")
const { random } = require("./util")
const Path = require("path")

module.exports = async function packBerial(asset, options) {
  asset.output.jsx = `
    (function({C,directs,wx}, remotes) {
      ${asset.output.jsx}
      render(fre.h($${asset.id},{data:data}),document.getElementById('root'))
    })(window,window.remotes);
    `
  const edir = Path.resolve(Path.dirname(options.e))

  const path = asset.path
    .replace(edir, "")
    .replace(/\\/g, "/")
    .replace(".json", "")

  const prefix = options.p ? options.p : "/"
  const basename = options.p ? `${"/" + Path.basename(options.p)}` : ""
  const hash = prefix + asset.hash
  manifest.push({
    id: asset.id,
    info: asset.ast,
    scripts: [hash + ".js", hash + ".jsx"],
    styles: [hash + ".css"],
    path: `${basename + path}`,
  })
  return asset.output.jsx
}
