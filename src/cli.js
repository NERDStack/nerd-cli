const program = require('commander');
const packageConfig = require('../package.json');
const install = require('./cli-install');
const cleanup = require('./cleanup');
const run = require('./run');

program.version(packageConfig.version);

program
  .command('install [dir]')
  .action(install)
  .description('install the base app');

program
  .command('run')
  .action(run)
  .description('run the app (local default)');

program
  .command('cleanup')
  .action(cleanup)
  .description('remove all unnecessary sample code');

program.parse(process.argv);

