const readline = require('readline');
const install = require('./install');
const data = require('./data');
const seedData = require('../sample-data/seed-data').seedData;
const postInstall = require('./post-install');
const utility = require('./apputil');
const exec = require('child_process').exec;

function askForData(message) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(message, answer => {
      if (!answer) {
        rl.close();
        reject(Error('No input detected'));
      }
      else {
        rl.close();
        resolve(answer);
      }
    });
  });
}

function showGitStatus(dir) {
  return new Promise((resolve, reject) => {
    exec('git status', { cwd: dir }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      if (stderr) {
        utility.displayError(stderr);
      }
      else if (stdout) {
        utility.displayLongInfo(stdout);
      }
      resolve();
    });
  });
}

module.exports = (dir) => {
  let ddbUri, ddbKey, databaseName, collectionName;

  askForData('DocumentDB account URI: ')
    .then(uri => ddbUri = uri)
    .then(() => askForData('DocumentDB account key: '))
    .then(key => ddbKey = key)
    .then(() => askForData('Database name (will be created): '))
    .then(dbName => databaseName = dbName)
    .then(() => askForData('Collection name (will be created): '))
    .then(collName => collectionName = collName)
    .then(() => {
      utility.displayInfo('Installing node_modules (this may take a minute...)');
      return install(dir);
    })
    .then(() => utility.displayInfo('Done installing node modules!'))
    .then(() => data.createCollection(ddbUri, ddbKey, {
      databaseName,
      collectionName
    }))
    .then(() => data.seedSampleData(ddbUri, ddbKey, {
      databaseName,
      collectionName
    }, seedData))
    .then(() => utility.displayInfo('Done seeding data!'))
    .then(() => postInstall(dir, ddbUri, ddbKey, { databaseName, collectionName }))
    .then(() => utility.displayInfo('Done creating start script!'))
    .then(() => utility.displayInfo('Showing git repo current status... (commit any changes before proceeding)'))
    .then(() => showGitStatus(dir))
    .then(() => utility.displayAction(`Change directory by running 'cd ${dir}' and run it 'nerd run'`))
    .catch(err => utility.displayError(err));
};

