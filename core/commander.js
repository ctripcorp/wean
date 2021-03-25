const { program } = require("commander");

program
  .arguments("[build]")
  .option("-v, --version", "get version")
  .option("-w, --watch", "wean watch")
  .option("-e, --entry <value>", "wean entry", "./app.json")
  .option("-o, --output <value>", "wean output", "./dist/")
  .option("-p, --public-url <value>", "wean public-url")
  .action((build, command) => (command.b = build))
  .parse();

const options = program.opts();

module.exports = options;
