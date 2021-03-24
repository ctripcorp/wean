const chokidar = require("chokidar")
const chalk = require('chalk')
const Path = require("path")
const build = require("./bundle")
const pack = require("./package")
const serve = require("./serve")
const argv = require('./commander')

async function run() {
  const options = {
    e: "./app.json",
    o: "./dist/",
    i: "/",
    w: argv.watch,
    e: argv.entry,
    o: argv.output,
    p: argv.publicUrl
  }
  console.log(options, 'options')
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
  options.old && options.old.close()
  const adt = await build(options.e, options)
  console.log(chalk.green("bundle success"))
  await pack(adt, options)
  console.log(chalk.green("package success"))
  options.old = serve(options)
}

run();
