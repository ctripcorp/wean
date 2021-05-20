const Asset = require("./asset")
const esbuild = require('esbuild')

module.exports = class JS extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse() {
    // todo, component tag
    const out = esbuild.buildSync({
      entryPoints: [this.path],
      bundle: true,
      format: 'esm',
      sourcemap: false,
      write: false,
      outdir: 'out',
      treeShaking: true
    }).outputFiles[0]

    this.code = String.fromCharCode.apply(null, out.contents)
  }
  async generate(input) {
  }
}
