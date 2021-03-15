#!/usr/bin/env node

const build = require("./bundle")
const pack = require("./package")
const serve = require("./serve")
const chokidar = require("chokidar")
const Path = require("path")

async function run(argv) {
  if (argv[0] === "-v" || argv[0] === "--version") {
    console.log("v0.0.1")
  } else {
    const options = getOptions(argv)
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
  log("bulid success")
  await pack(adt, options)
  log("package success")
  options.old = serve()
}

const getOptions = (argv) => {
  let out = {
    e: "app.json",
    o: "/dist/",
  }
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i]
    const value = argv[i + 1]
    if (name === "-w" || name === "--watch") {
      out["w"] = true
    }
    if (name[0] !== "-" || !value) {
      continue
    }
    if (name === "-e" || name === "--entry") {
      out["e"] = value
    }
    if (name === "-o" || name === "--output") {
      out["o"] = value
    }
  }
  return out
}

run(process.argv.slice(2))

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