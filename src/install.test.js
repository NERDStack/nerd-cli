const fs = require('fs');
const path = require('path');
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

/* eslint-enable no-undef */

