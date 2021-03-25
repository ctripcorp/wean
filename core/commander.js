const { program } = require("commander")

program
  .arguments("[buildType]")
  .option("-v, --version", "get version")
  .option("-w, --watch", "wean watch", false)
  .option("-m, --minify", "wean minify", false)
  .option("-e, --entry <value>", "wean entry", "./app.json")
  .option("-o, --output <value>", "wean output", "./dist/")
  .option("-p, --public-url <value>", "wean public-url")
  .action((buildType, command) => (command.t = buildType))
  .parse()

const options = program.opts()

module.exports = options
