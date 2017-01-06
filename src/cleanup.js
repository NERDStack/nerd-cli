const exec = require('child_process').exec;

module.exports = () => {
  return new Promise((resolve, reject) => {
    exec('npm run cleanup', err => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
};

