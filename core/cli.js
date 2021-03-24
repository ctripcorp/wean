
const argv = require('./commander')
const chalk = require('chalk')

const cmdMap = new Map([
  ['serve', () => { console.log('run serve') }],
  ['build', () => require('./run')],
  ['version', () => console.log(require('../package.json').version)]
])

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
