const chokidar = require("chokidar")
const Path = require("path")
const build = require("./bundle")
const pack = require("./package")
const serve = require("./serve")
const argv = require("./commander")
const ora = require('ora')
const BUILD_TYPE = {
  BUILD: 'build'
}

async function run(argv) {
  const options = {
    e: argv.entry,
    o: argv.output,
    i: "/",
    w: argv.watch,
    m: argv.minify,
    p: argv.publicUrl,
    t: argv.t,
  }
  start(options)
  if (options.w) {
    chokidar
      .watch(Path.dirname(options.e), {
        ignored: /(dist|.git)/,
        persistent: true,
        awaitWriteFinish: {
          stabilityThreshold: 500,
          pollInterval: 500,
        },
      })
      .on("change", (path) => {
        console.log(`rebuild ${path}`)
        start(options)
      })
  }
}

async function start(options) {
  options.old && options.old.close()
  const spinner = ora('start compiling').start()
  const start = Date.now()
  const adt = await build(options.e, options)
  await pack(adt, options)
  const end = Date.now()
  spinner.succeed(`compile total time ${end - start}ms`)
  // if (options.t === BUILD_TYPE.BUILD) {
  //   console.log(chalk.green("build success"))
  // } else {
  //   options.old = serve(options)
  // }
}

if (argv.version) {
  console.log('version:', require('../package.json').version)
} else {
  run(argv)
}
