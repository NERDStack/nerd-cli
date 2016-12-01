const path = require('path');
const Git = require('nodegit');
const npm = require('npm');

function cloneRepo(destination) {
  const repoUrl = 'https://github.com/NERDStack/nerdy-movies';
  return Git.Clone(repoUrl, destination);
}

function fullWorkingDirectory(dir) {
  return path.join(process.cwd(), dir);
}

module.exports = (dir) => {
  return cloneRepo(fullWorkingDirectory(dir));
};

