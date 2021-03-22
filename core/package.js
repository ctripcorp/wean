const { promises } = require("fs")
const ejs = require("ejs")
const Path = require("path")

const manifest = []

module.exports.manifest = manifest

const packJs = require("./packagers/js.js")
const packWxss = require("./packagers/wxss.js")
const packWxml = require("./packagers/wxml.js")
const packBerial = require("./packagers/berial.js")

module.exports = async function pack(asset, options) {
  options.umds = []
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
      asset.output.jsx = await packBerial(asset, options)
      write(asset, options)
    } else if (asset.type === "app") {
      asset.outputPath = Path.resolve(options.o) + `\\${asset.hash}`
      asset.output.js = asset.siblingAssets.get(".js").code
      asset.output.css = asset.siblingAssets.get(".wxss").code
      options.umds.push("./" + asset.hash + ".js")
      write(asset, options)
    }
  })
  await Promise.all(all)
}

async function write(asset, options) {
  await promises.mkdir(Path.resolve(options.o), { recursive: true })
  for (const key in asset.output) {
    let path = asset.outputPath + `.${key}`
    await promises.writeFile(path, asset.output[key])
  }
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
  let umds = [
    "./sdk/berial.js",
    "./sdk/fre.js",
    "./sdk/goober.js",
    "./runtime/api.js",
    "./runtime/wx.js",
    "./runtime/components.js",
  ]
  let umdPromises = umds.map(async (u) => {
    const dist = Path.join(Path.resolve(options.o), u)
    await promises.mkdir(Path.dirname(dist), { recursive: true })
    await promises.copyFile(Path.join(__dirname, u), dist)
  })
  await Promise.all(umdPromises)
  options.umds = umds.concat(options.umds)
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
