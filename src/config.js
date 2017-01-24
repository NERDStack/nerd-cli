const fs = require('fs');
const path = require('path');

const configFileName = path.join(
  process.env[process.platform === 'win32' ? 'USERPROFILE': 'HOME'],
  '.nerd'
);

module.exports.saveConfig = config => {
  return new Promise((resolve, reject) => {
    fs.writeFile(configFileName, JSON.stringify(config, null, '  '), 'utf8', err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

module.exports.loadConfig = () => {
  return new Promise(resolve => {
    fs.readFile(configFileName, 'utf8', (err, data) => {
      if (err) {
        resolve({});
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};
