const Asset = require('./asset')
const esbuild = require('esbuild')
const componentTag = require('../plugins/esbuild-component-tag')

module.exports = class JS extends Asset {
  constructor(path, type, name) {
    super(path, type, name)
  }
  async transform() {
    const out = await esbuild.build({
      entryPoints: [this.path],
      bundle: true,
      format: 'esm',
      sourcemap: false,
      write: false,
      outdir: 'out',
      treeShaking: true,
      plugins: [
        componentTag({
          id: this.parent.id + ''
        })
      ]
    })

    this.code = String.fromCharCode.apply(null, out.outputFiles[0].contents)
  }
}
