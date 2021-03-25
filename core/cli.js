const chokidar = require("chokidar")
const chalk = require("chalk")
const Path = require("path")
const build = require("./bundle")
const pack = require("./package")
const serve = require("./serve")
const argv = require("./commander")
const { BUILD_TYPE } = require("./util/constant")

async function run(argv) {
  const options = {
    e: argv.entry || './app.json',
    o: argv.output || './dist/',
    i: "/",
    w: argv.watch,
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
        console.log(chalk.green(`rebuild ${path}`))
        start(options)
      })
  }
}

async function start(options) {
  console.log(options)
  options.old && options.old.close()
  const adt = await build(options.e, options)
  console.log(chalk.green("bundle success"))
  await pack(adt, options)
  console.log(chalk.green("package success"))
  if (options.t === BUILD_TYPE.BUILD) {
    console.log(chalk.green("build success"))
  } else {
    options.old = serve(options)
  }
}

if (argv.version) {
  console.log('version:', require('../package.json').version)
} else {
  run(argv)
}
