const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const install = require('./install');

const destinationDir = 'testdir';
const destinationDirNodeModulesTest = 'nmtest';

/* eslint-disable no-undef */

test('remote repo is cloned', () => {
  install(destinationDir)
    .then(() => {
      const destinationRepoPath = path.join(process.cwd(), destinationDir);
      console.log(`testing existence of ${destinationRepoPath}`);
      fs.stat(destinationRepoPath, (err) => {
        expect(err).toBeUndefined();
      });
    })
    .catch(err => {
      throw err;
    });
});

test('npm modules installed', () => {
  install(destinationDirNodeModulesTest)
    .then(() => {
      const nodeModulesPath = path.join(process.cwd(), destinationDirNodeModulesTest, 'node_modules');
      console.log(`testing existence of ${nodeModulesPath}`);
      fs.stat(nodeModulesPath, (err) => {
        expect(err).toBeUndefined();
      });
    })
    .catch(err => {
      throw err;
    });
});

afterEach(() => {
  const destinationRepoPath = path.join(process.cwd(), destinationDir);
  const nodeModulesTestRepoPath = path.join(process.cwd(), destinationDirNodeModulesTest);
  fs.stat(destinationRepoPath, (err) => {
    if (!err) {
      rimraf(destinationRepoPath, err => {
        if (err) {
          console.log(`error removing test repo clone locally :: ${err.message}`);
        }
        else {
          console.log(`successfully removed ${destinationRepoPath}`);
        }
      });
    }
  });
  fs.stat(nodeModulesTestRepoPath, (err) => {
    if (!err) {
      rimraf(nodeModulesTestRepoPath, err => {
        if (err) {
          console.log(`error removing node modules test repo clone :: ${err.message}`);
        }
        else {
          console.log(`successfully removed ${nodeModulesTestRepoPath}`);
        }
      });
    }
  });
});

/* eslint-enable no-undef */

