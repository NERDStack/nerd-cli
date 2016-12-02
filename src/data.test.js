const data = require('./data');

/* eslint-disable no-undef */

it('documentdb collection is created', () => {
  const docdbUri = process.env.DOCUMENTDB_URI;
  const docdbKey = process.env.DOCUMENTDB_KEY;
  return data.createCollection(docdbUri, docdbKey)
    .then(
      res => expect(res).toBeTruthy(),
      err => expect(err).toBeNull()
    );
});

/* eslint-enable no undef */

