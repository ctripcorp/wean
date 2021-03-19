const { promises } = require("fs")
const ejs = require('ejs')
const Path = require("path")
const manifest = []
module.exports.manifest = manifest
module.exports.convert = convert

const packJs = require('./packagers/js.js')
const packWxss = require('./packagers/wxss.js')
const packWxml = require('./packagers/wxml.js')
const packJson = require('./packagers/json.js')

module.exports = async function pack(asset, options) {
  await convert(asset, options)
  await copySdk(options)
  await generateEntry(options)
}

async function copySdk(options) {
  options.umds = [
    "./sdk/berial.js",
    "./sdk/fre.js",
    "./sdk/goober.js",
    "./runtime/api.js",
    "./runtime/wx.js",
    "./runtime/components.js",
    "./runtime/directs.js",
  ]
  let umdPromises = options.umds.map(async (u) => {
    const dist = Path.join(Path.resolve(options.o), u)
    await promises.mkdir(Path.dirname(dist), { recursive: true })
    await promises.copyFile(Path.join(__dirname, u), dist)
  })
  await Promise.all(umdPromises)
}

async function generateEntry(options) {
  const html = await ejs.renderFile(
    Path.resolve(__dirname, 'index.ejs'),
    {
      umds: options.umds,
      manifest
    }
  )
  await promises.writeFile(
    Path.join(Path.resolve(options.o), "index.html"),
    html
  )
}

async function convert(asset, options) {
  const isRoot = asset.parent && asset.parent.type === "json"

  asset.outputPath = Path.resolve(options.o, (asset.parent || asset).hash + asset.ext)

  if (asset.name === 'app.js') {
    // TODO 这里在重构 ADT 后就不用单独处理了
    asset.outputPath = Path.resolve(options.o, './app.js')
  }

  switch (asset.type) {
    case "wxss":
      isRoot && packWxss(asset)
      break
    case "js":
      isRoot && packJs(asset, options)
      break
    case "wxml":
      isRoot && packWxml(asset, options)
      break
    case "json":
      packJson(asset, options)
      break
    default:
      break
  }
}
