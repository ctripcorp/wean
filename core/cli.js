
const argv = require('./commander')
const chalk = require('chalk')

const cmd = cmdMap.get(argv.type);

if (cmd) {
  cmd();
} else {
  console.log(
    chalk.yellow(`
    No commander is specified.
  `),
  );
}
