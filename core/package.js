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

async function packageAsset(asset, options) {
  await packageJson(asset, options)
  const all = Array.from(asset.childAssets.values()).map(async (child) => {
    await packageAsset(child, options)
    if (asset.type === "page") {
      asset.output.css += child.output.css
      asset.output.js += child.output.js
      asset.output.jsx += child.output.jsx
    }
  })
  await Promise.all(all)
}

async function packageJson(asset, options) {
  const siblings = asset.siblingAssets
  if (siblings) {
    siblings.forEach(async (value, key) => {
      if (value) {
        if (key === ".js") asset.output.js = await packJs(siblings.get(".js"))
        if (key === ".wxml")
          asset.output.jsx = await packWxml(siblings.get(".wxml"), options)
        if (key === ".wxss")
          asset.output.css = await packWxss(siblings.get(".wxss"))
      }
    })
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
