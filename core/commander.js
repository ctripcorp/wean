const { program } = require('commander');

program
  .arguments('<type>')
  .option('-v, --version', 'get version')
  .option('-w, --watch', 'wean watch')
  .option('-e, --entry <value>', 'wean entry')
  .option('-o, --output <value>', 'wean output')
  .option('-p, --public-url <value>', 'wean public-url')
  .action((type, command) => command.type = type)
  .parse(process.argv);

const options = program.opts();

module.exports = options;
