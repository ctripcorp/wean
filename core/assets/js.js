const Asset = require("./asset")
const esbuild = require('esbuild')
const componentTag = require('../plugins/esbuild-component-tag')

module.exports = class JS extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async parse() {
    // todo, component tag
    const out = await esbuild.build({
      entryPoints: [this.path],
      bundle: true,
      format: 'esm',
      sourcemap: false,
      write: false,
      outdir: 'out',
      treeShaking: true,
      plugins: [componentTag({
        tag: this.parent.tag
      })]
    })

    this.code = String.fromCharCode.apply(null, out.outputFiles[0].contents)
  }
  async generate(input) {
  }
}
