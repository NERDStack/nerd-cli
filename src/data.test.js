const DocumentClient = require('documentdb').DocumentClient;
const data = require('./data');

const docdbUri = process.env.DOCUMENTDB_URI;
const docdbKey = process.env.DOCUMENTDB_KEY;
const databaseName = 'clitestdb';
const collectionName = 'clitestcoll';

/* eslint-disable no-undef */

it('documentdb collection is created', () => {
  return data.createCollection(docdbUri, docdbKey, databaseName, collectionName)
    .then(
      res => expect(res).toBeTruthy(),
      err => expect(err).toBeNull()
    );
});

afterAll(() => {
  return new Promise((resolve, reject) => {
    const client = new DocumentClient(docdbUri, { masterKey: docdbKey });
    const querySpec = {
      query: 'select * from root r where r.id = @id',
      parameters: [{
        name: '@id',
        value: databaseName
      }]
    };
    client.queryDatabases(querySpec).toArray((err, results) => {
      if (err) {
        reject(err);
      }
      else if (results.length === 0) {
        // in this case, the database didn't exist
        resolve();
      }
      else {
        client.deleteDatabase(results[0]._self, err => {
          if (err) {
            reject(err);
          }
          else {
            resolve();
          }
        });
      }
    });
  });
});

/* eslint-enable no undef */

