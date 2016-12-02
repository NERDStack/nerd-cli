const DocumentClient = require('documentdb').DocumentClient;
const data = require('./data');
const sampleData = require('../sample-data/seed-data');

const docdbUri = process.env.DOCUMENTDB_URI;
const docdbKey = process.env.DOCUMENTDB_KEY;
const databaseName = 'clitestdb';
const collectionName = 'clitestcoll';

/* eslint-disable no-undef */

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

it('documentdb collection is created', () => {
  return data.createCollection(docdbUri, docdbKey, { databaseName, collectionName })
    .then(
      res => expect(res).toBeTruthy(),
      err => expect(err).toBeNull()
    );
});

it('sample data is inserted', () => {
  return data.seedSampleData(
    docdbUri, docdbKey, { databaseName, collectionName }, sampleData.seedData)
    .then(
      () => {
        const client = new DocumentClient(docdbUri, { masterKey: docdbKey });
        const querySpecDb = {
          query: 'select * from root r where r.id = @id',
          parameters: [{
            name: '@id',
            value: databaseName
          }]
        };
        client.queryDatabases(querySpecDb).toArray((err, results) => {
          expect(err).toBeFalsy();
          expect(results.length).toBeGreaterThan(0);
          const querySpecColl = {
            query: 'select * from root r where r.id = @id',
            parameters: [{
              name: '@id',
              value: collectionName
            }]
          };
          client.queryCollections(results[0]._self, querySpecColl, (err, results) => {
            expect(err).toBeFalsy();
            expect(results.length).toBeGreaterThan(0);
            client.queryDocuments(results[0]._self, 'select * from root', (err, results) => {
              expect(err).toBeFalsy();
              expect(results.length).toBeGreaterThan(0);
              resolve();
            });
          });
        });
      },
      err => expect(err).toBeFalsy()
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

