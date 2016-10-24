const program = require('commander');
const package = require('../package.json');
const install = require('./install').install;
const cleanup = require('./cleanup').cleanup;

program.version(package.version);

program
  .command('install')
  .action(install)
  .description('install the base app');

program
  .command('cleanup')
  .action(cleanup)
  .description('remove all unnecessary sample code');

program.parse(process.argv);

