const readline = require('readline');
const install = require('./install');
const data = require('./data');
const seedData = require('../sample-data/seed-data').seedData;

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
      console.log('Installing node modules');
      return install(dir);
    })
    .then(() => console.log('done installing node modules'))
    .then(() => data.createCollection(ddbUri, ddbKey, {
      databaseName,
      collectionName
    }))
    .then(() => data.seedSampleData(ddbUri, ddbKey, {
      databaseName,
      collectionName
    }, seedData))
    .then(() => console.log('done!'));
};

