const program = require('commander');
const packageConfig = require('../package.json');
const install = require('./install').install;
const cleanup = require('./cleanup').cleanup;

program.version(packageConfig.version);

program
  .command('install [dir]')
  .action(install)
  .description('install the base app');

program
  .command('cleanup')
  .action(cleanup)
  .description('remove all unnecessary sample code');

program.parse(process.argv);

