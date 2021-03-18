const { program } = require('commander');

program
  .option('-v, --version', 'get version')
  .option('-w, --watch', 'wean watch')
  .option('-e, --entry <value>', 'wean entry')
  .option('-o, --output <value>', 'wean output')
  .parse(process.argv);

const options = program.opts();

module.exports = options;
