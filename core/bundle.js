const fs = require("fs")
const { promises } = fs
const Path = require("path")
const options = {
  inputDir: '/'
}

module.exports = async function build(main) {
  const rootJson = await resolveAsset(Path.resolve(main || ""))
  options.inputDir = Path.dirname(rootJson.path)
  await loadAsset(rootJson)
  return rootJson
}

async function loadAsset(asset) {
  if (asset.path) {
    const input = await promises.readFile(asset.path)
    await asset.parse(input.toString())
    await asset.generate()
  }
  const dependencies = Array.from(asset.dependencies)
  const all = dependencies.map(async (dep) => {
    const depAsset = await resolveAsset(dep.path, asset.path)
    depAsset.tag = dep.tag || null
    asset.depsAssets.set(dep, depAsset)
    depAsset.parent = asset
    await loadAsset(depAsset)
  })
  await Promise.all(all)
}

async function resolveAsset(path = "", parent = "") {
  const type = Path.extname(path)
  switch (type) {
    case ".js":
      Asset = require("./assets/js")
      break
    case ".json":
      Asset = require("./assets/json")
      break
    case ".wxml":
      Asset = require("./assets/wxml")
      break
    case ".wxss":
      Asset = require("./assets/wxss")
      break
    default:
      break
  }

  let resolvePath = Path.join(Path.dirname(parent), path)
  if (!fs.existsSync(resolvePath)) {
    resolvePath = Path.join(options.inputDir, path)
  }
  return new Asset(resolvePath, type, path)
}

module.exports.options = options