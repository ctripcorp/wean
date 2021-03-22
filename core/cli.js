#!/usr/bin/env node

const build = require("./bundle")
const pack = require("./package")
const serve = require("./serve")
const argv = require('./commander')
const chokidar = require("chokidar")
const Path = require("path")

async function run(argv) {
  if (argv.version) {
    console.log("v0.0.1")
  } else {
    const options = {
      e: "./demo/app.json",
      o: "./dist/",
      w: argv.watch,
      e: argv.entry,
      o: argv.output
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
          log(`rebuild ${path}`, 1)
          start(options)
        })
    }
  }
}

async function start(options) {
  options.old && options.old.close()
  const adt = await build(options.e)
  // console.log(adt)
  log("bulid success")
  await pack(adt, options)
  log("package success")
  options.old = serve()
}

run(argv)

function log(msg, color) {
  switch (color) {
    case 1:
      console.log("\033[43;30m DONE \033[40;33m " + msg + "\033[0m")
      break
    default:
      console.log("\033[42;30m DONE \033[40;32m " + msg + "\033[0m")
      break
  }
}

module.exports.log = log
