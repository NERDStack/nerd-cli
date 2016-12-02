const fs = require('fs');
const path = require('path');

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

module.exports = (dir, documentdbUri, documentdbKey) => {
  return copyAndModifyStartLocalScript(dir, documentdbUri, documentdbKey); 
};

