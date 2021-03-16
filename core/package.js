const { promises } = require("fs")
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
  let umds = options.umds
    .concat(["./app.js"])
    .map((u) => `<script src="${u}"></script>`)
    .join("\n")
  let html = `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>wean-demo</title>
      <link rel="stylesheet" type="text/css" href="//at.alicdn.com/t/font_2365862_1fzp0ur9aqn.css">
      <style>
      *{
        margin:0;
        padding:0
      }
      html {
        font-size: calc(100vw / 7.50);
      }
      body{
        --primary-color: #2577e3;
        --primary-border-color: #1d67dd;
        --warn-color: #e65f40;
        --warn-border-color: #E64340;
        --default-color: #f0f2f5;
        --default-border-color: #eaecef;
        --link-color: #576b95;
        --outline-color: #bfd7fd;
      }
      </style>  
      ${umds}
  </head>
  <body>
      ${generateBerialCode()}
  </body>
  </html>`
  await promises.writeFile(
    Path.join(Path.resolve(options.o), "index.html"),
    html
  )
}

function generateBerialCode() {
  const dom = `${manifest.map(({ name }) => `<${name}></${name}>`).join("\n")}`
  const script = `
  <script>
    goober.setup(fre.h);
    berial.register(${JSON.stringify(manifest)})
  </script>
  `
  return dom + script
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
