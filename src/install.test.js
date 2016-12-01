const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const install = require('./install');

const destinationDir = 'testdir';
const destinationDirNodeModulesTest = 'nmtest';

/* eslint-disable no-undef */

jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

it('remote repo is cloned', () => {
  return install(destinationDir)
    .then(() => {
      const destinationRepoPath = path.join(process.cwd(), destinationDir);
      console.log(`testing existence of ${destinationRepoPath}`);
      return new Promise((resolve, reject) => {
        fs.stat(destinationRepoPath, (err) => {
          expect(err).toBeNull();
          if (err) {
            reject(err);
          }
          else {
            resolve();
          }
        });
      });
    });
});

it('npm modules installed', () => {
  return install(destinationDirNodeModulesTest)
    .then(() => {
      const nodeModulesPath = path.join(process.cwd(), destinationDirNodeModulesTest, 'node_modules');
      console.log(`testing existence of ${nodeModulesPath}`);
      return new Promise((resolve, reject) => {
        fs.stat(nodeModulesPath, (err) => {
          expect(err).toBeNull();
          if (err) {
            reject(err);
          }
          else {
            resolve();
          }
        });
      });
    });
});

afterAll(() => {
  console.log('in afterAll');
  const testRepoClonePath = path.join(process.cwd(), destinationDir);
  const testNodeModulesPath = path.join(process.cwd(), destinationDirNodeModulesTest);
  return new Promise((resolve, reject) => {
    fs.stat(testRepoClonePath, err => {
      if (!err) {
        rimraf(testRepoClonePath, err => {
          if (err) {
            reject(err);
          }
          else {
            fs.stat(testNodeModulesPath, err => {
              if (!err) {
                rimraf(testNodeModulesPath, err => {
                  if (err) {
                    reject(err);
                  }
                  else {
                    resolve();
                  }
                });
              }
              else {
                resolve();
              }
            });
          }
        });
      }
      else {
        resolve();
      }
    });
  });
});

/* eslint-enable no-undef */

