const { program } = require('commander');

program
  .option('-v, --version', 'get version')
  .option('-w, --watch', 'wean watch')
  .option('-e, --entry <value>', 'wean entry')
  .option('-o, --output <value>', 'wean output')
  .option('-p, --public-url <value>', 'wean public-url')
  .parse(process.argv);

const options = program.opts();

console.log(options)

module.exports = options;
