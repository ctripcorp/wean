const { promises } = require("fs")
const ejs = require("ejs")
const Path = require("path")
const esbuild = require('esbuild')

const manifest = []

module.exports.manifest = manifest

const packJs = require("./packagers/js.js")
const packWxss = require("./packagers/wxss.js")
const packWxml = require("./packagers/wxml.js")
const packBerial = require("./packagers/berial.js")

module.exports = async function pack(asset, options) {
  await packageAsset(asset, options)
  await writeAsset(asset, options)
  await generateEntry(asset, options)
}

async function writeAsset(asset, options) {
  asset.outputPath = Path.resolve(options.o, asset.hash)
  asset.output.js = asset.siblingAssets.get(".js").code
  await write(asset, options)

  const childs = Array.from(asset.childAssets.values()).map(async (page) => {
    await packBerial(page, options)
    await write(page, options)
  })
  await Promise.all(childs)
}

async function packageAsset(asset, options) {
  await packageJson(asset, options)
  const page = getPage(asset)
  if (asset.type === "component" && page) {
    page.output.jsx += asset.output.jsx
    page.output.js += asset.output.js
    page.output.css += asset.output.css
  }
  const all = Array.from(asset.childAssets.values()).map(async (child) => {
    await packageAsset(child, options)
  })

  await Promise.all(all)
}

function getPage(asset) {
  let p = asset
  while (p && (p = p.parent)) {
    if (p.type === 'page') {
      return p
    }
  }
}

async function write(asset, options) {
  await promises.mkdir(Path.resolve(options.o), { recursive: true })
  for (const key in asset.output) {
    let path = `${asset.outputPath}.${key}`
    let code = asset.output[key]

    if (options.m) {
      code = await esbuild.transform(code, {
        loader: key,
        minify: true
      })
    }

    await promises.writeFile(path, code)
  }
}

async function packageJson(asset, options) {
  const siblings = asset.siblingAssets
  if (siblings) {
    const all = Array.from(siblings.keys()).map(async (key) => {
      const value = siblings.get(key)
      switch (key) {
        case ".js":
          asset.output.js = await packJs(value, options)
          break
        case ".wxml":
          asset.output.jsx = await packWxml(value, options)
          break
        case ".wxss":
          asset.output.css = await packWxss(value)
          break
      }
    })
    await Promise.all(all)
  }
}

async function generateEntry(asset, options) {
  const o = Path.resolve(options.o)
  await promises.mkdir(Path.join(o, 'public'), { recursive: true })

  const tabbars = asset.ast.tabBar.list
  const all = tabbars.map(async item => {
    let { iconPath, selectedIconPath } = item
    const $1 = Path.join(o, 'public', Path.basename(iconPath))
    const $2 = Path.join(o, 'public', Path.basename(selectedIconPath))
    await promises.copyFile(iconPath, $1)
    item.iconPath = $1
    await promises.copyFile(selectedIconPath, $2)
    item.selectedIconPath = $2
  })
  await Promise.all(all)

  const pages = manifest
  const json = {
    info: asset.ast,
    pages,
  }
  let out = JSON.stringify(json)
  await promises.writeFile(
    Path.join(Path.resolve(options.o), "manifest.json"),
    out
  )
}
