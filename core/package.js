const { promises } = require("fs")
const ejs = require("ejs")
const Path = require("path")
const manifest = []
module.exports.manifest = manifest

const packJs = require("./packagers/js.js")
const packWxss = require("./packagers/wxss.js")
const packWxml = require("./packagers/wxml.js")

module.exports = async function pack(asset, options) {
  await packageAsset(asset, options)
  await copySdk(options)
  await generateEntry(options)
}

async function packageAsset(asset) {
  const all = Array.from(asset.childAssets.values()).map(
    async (child) => await packageJson(child)
  )
  await Promise.all(all)
}

async function packageJson(asset) {
  const siblings = asset.siblingAssets
  if (siblings) {
    // await packJs(siblings.get(".js"))
    // await packWxml(siblings.get(".wxml"))
    await packWxss(siblings.get(".wxss"))
  }
}

async function copySdk(options) {
  options.umds = [
    "./sdk/berial.js",
    "./sdk/fre.js",
    "./sdk/goober.js",
    "./runtime/api.js",
    "./runtime/wx.js",
    "./runtime/components.js",
  ]
  let umdPromises = options.umds.map(async (u) => {
    const dist = Path.join(Path.resolve(options.o), u)
    await promises.mkdir(Path.dirname(dist), { recursive: true })
    await promises.copyFile(Path.join(__dirname, u), dist)
  })
  await Promise.all(umdPromises)
}

async function generateEntry(options) {
  const html = await ejs.renderFile(Path.resolve(__dirname, "index.ejs"), {
    umds: options.umds,
    manifest,
  })
  await promises.writeFile(
    Path.join(Path.resolve(options.o), "index.html"),
    html
  )
}
