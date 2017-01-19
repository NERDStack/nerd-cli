const exec = require('child_process').exec;
const path = require('path');

function cloneRepo(destination) {
  return new Promise((resolve, reject) => {
    const repoUrl = 'https://github.com/NERDStack/nerdy-movies';
    exec(`git clone ${repoUrl} ${destination}`, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function fullWorkingDirectory(dir) {
  return path.join(process.cwd(), dir);
}

module.exports = (dir) => {
  const fullLocalRepoPath = fullWorkingDirectory(dir);
  return cloneRepo(fullLocalRepoPath)
    .then(() => {
      return new Promise((resolve, reject) => {
        exec('npm install', { cwd: fullLocalRepoPath }, err => {
          if (err) {
            reject(err);
          }
          else {
            resolve();
          }
        });
      });
    })
    .catch(err => console.log(err.message));
};

