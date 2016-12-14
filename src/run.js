const exec = require('child_process').exec;

module.exports = () => {
  return new Promise((resolve, reject) => {
    exec('npm run build && npm run start-local', err => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    }).stdout.pipe(process.stdout);
  });
};

