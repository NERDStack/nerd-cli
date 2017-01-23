const program = require('commander');
const packageConfig = require('../package.json');
const install = require('./cli-install');
const cleanup = require('./cleanup');
const run = require('./run');
const azurePublish = require('./azure').publish;
const azureRegions = require('./azure').listRegions;

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

program
  .command('publish')
  .action(azurePublish)
  .description('publish to Azure');

program
  .command('regions')
  .action(azureRegions)
  .description('list all available Azure regions');

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
