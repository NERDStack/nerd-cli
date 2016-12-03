const fs = require('fs');
const path = require('path');

function modifyDataConfig(dir, databaseName, collectionName) {
  return new Promise((resolve, reject) => {
    const pathToDataConfig = path.join(dir, 'server', 'data', 'config.js');
    /* eslint-disable quotes */
    const sourceDbNameIndicator = "'nerdymovies'";
    const sourceCollNameIndicator = "'movies'";
    /* eslint-enable quotes */

    fs.readFile(pathToDataConfig, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        const newData = data.replace(sourceDbNameIndicator, `'${databaseName}'`).replace(sourceCollNameIndicator, `'${collectionName}'`);
        fs.writeFile(pathToDataConfig, newData, 'utf8', err => {
          if (err) {
            reject(err);
          }
          else {
            resolve();
          }
        });
      }
    });
  });
}

function copyAndModifyStartLocalScript(dir, documentdbUri, documentdbKey) {
  return new Promise((resolve, reject) => {
    const containingDirName = 'scripts';
    const sourceFileName = 'start-local.sample.sh';
    const fullSourceFileName = path.join(dir, containingDirName, sourceFileName);
    const destinationFileName = 'start-local.sh';
    const fullDestinationFileName = path.join(dir, containingDirName, destinationFileName);
    const sourceUriIndicator = 'your documentdb uri';
    const sourceKeyIndicator = 'your documentdb key';

    fs.readFile(fullSourceFileName, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        const newData = data.replace(sourceUriIndicator, documentdbUri).replace(sourceKeyIndicator, documentdbKey);
        fs.writeFile(fullDestinationFileName, newData, 'utf8', err => {
          if (err) {
            reject(err);
          }
          else {
            resolve();
          }
        });
      }
    });
  });
}

module.exports = (dir, documentdbUri, documentdbKey, connInfo) => {
  return copyAndModifyStartLocalScript(dir, documentdbUri, documentdbKey)
    .then(() => modifyDataConfig(dir, connInfo.databaseName, connInfo.collectionName));
};

