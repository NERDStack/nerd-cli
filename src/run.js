const exec = require('child_process').exec;

module.exports = () => {
  return new Promise((resolve, reject) => {
    const runScriptName = process.platform === 'win32' ? 'start-local-win' : 'start-local';
    exec(`npm run build && npm run ${runScriptName}`, err => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    }).stdout.pipe(process.stdout);
  });
};

