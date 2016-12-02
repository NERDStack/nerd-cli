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

    const sourceStream = fs.createReadStream(fullSourceFileName);
    const destinationStream = fs.createWriteStream(fullDestinationFileName);

    sourceStream.on('line', line => {
      destinationStream.write(line
        .replace(sourceUriIndicator, documentdbUri)
        .replace(sourceKeyIndicator, documentdbKey));
    });

    sourceStream.on('close', () => {
      destinationStream.close();
      resolve();
    });

    sourceStream.on('error', err => {
      reject(err);
    });
    destinationStream.on('error', err => {
      reject(err);
    });
  });
}

module.exports = (dir, documentdbUri, documentdbKey) => {
  return copyAndModifyStartLocalScript(dir, documentdbUri, documentdbKey); 
};

