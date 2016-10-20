const program = require('commander');
const package = require('../package.json');

program.version(package.version);

program
  .command('install')
  .action(() => {
    console.log('install operation');
  })
  .description('install the base app');

program
  .command('cleanup')
  .action(() => {
    console.log('cleanup operation');
  })
  .description('remove all unnecessary sample code');

program.parse(process.argv);

