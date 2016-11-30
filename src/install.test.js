const fs = require('fs');
const path = require('path');
const install = require('./install');

const destinationDir = 'testdir';

test('remote repo is cloned', () => {
  install(destinationDir)
    .then(() => {
      fs.stat(path.join(process.cwd(), destinationDir), (err) => {
        expect(err).toBeUndefined();
      });
    })
    .catch(err => expect(err).toBeUndefined());
});

