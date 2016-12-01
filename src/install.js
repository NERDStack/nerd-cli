const exec = require('child_process').exec;
const path = require('path');
const Git = require('nodegit');

function cloneRepo(destination) {
  const repoUrl = 'https://github.com/NERDStack/nerdy-movies';
  return Git.Clone(repoUrl, destination);
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
    });
};

