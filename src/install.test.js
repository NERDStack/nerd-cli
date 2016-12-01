const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const install = require('./install');

const destinationDir = 'testdir';

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

afterAll(() => {
  const destinationRepoPath = path.join(process.cwd(), destinationDir);
  rimraf(destinationRepoPath, err => {
    if (err) {
      console.log(`error removing test repo clone locally :: ${err.message}`);
    }
    else {
      console.log(`successfully removed ${destinationRepoPath}`);
    }
  });
});

/* eslint-enable no-undef */

