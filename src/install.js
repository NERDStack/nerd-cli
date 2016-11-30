const path = require('path');
const Git = require('nodegit');

function cloneRepo(destination) {
  const repoUrl = 'https://github.com/NERDStack/nerdy-movies';
  return Git.Close(repoUrl, destination);
}

function fullWorkingDirectory(dir) {
  return path.join(process.cwd(), dir);
}

module.exports = (dir) => {
  console.log(`Install in ${dir}`);
  console.log(fullWorkingDirectory(dir));
}

