const DocumentClient = require('documentdb').DocumentClient;

function getCollectionLink(documentdbUri, documentdbKey, connInfo) {
  return new Promise((resolve, reject) => {
    const client = new DocumentClient(documentdbUri, { masterKey: documentdbKey });
    const querySpecDb = {
      query: 'select * from root r where r.id = @id',
      parameters: [{
        name: '@id',
        value: connInfo.databaseName
      }]
    };
    client.queryDatabases(querySpecDb).toArray((err, results) => {
      if (err) {
        reject(err);
      }
      else if (results.length === 0) {
        reject(Error(`Database ${connInfo.databaseName} not found`));
      }
      else {
        const querySpecColl = {
          query: 'select * from root r where r.id = @id',
          parameters: [{
            name: '@id',
            value: connInfo.collectionName
          }]
        };
        client.queryCollections(results[0]._self, querySpecColl).toArray((err, results) => {
          if (err) {
            reject(err);
          }
          else if (results.length === 0) {
            reject(Error(`Collection ${connInfo.collectionName} not found in database ${connInfo.databaseName}`));
          }
          else {
            resolve(results[0]);
          }
        });
      }
    });
  });
}

module.exports.createCollection = (documentdbUri, documentdbKey, connInfo) => {
  return new Promise((resolve, reject) => {
    const client = new DocumentClient(documentdbUri, { masterKey: documentdbKey });

    client.createDatabase({ id: connInfo.databaseName }, (err, database) => {
      if (err) {
        reject(err);
      }
      else {
        client.createCollection(database._self, { id: connInfo.collectionName }, (err, collection) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(collection);
          }
        });
      }
    });
  });
};

module.exports.seedSampleData = (documentdbUri, documentdbKey, connInfo, sampleData) => {
  return getCollectionLink(documentdbUri, documentdbKey, connInfo)
    .then(
      collLink => {
        const client = new DocumentClient(documentdbUri, { masterKey: documentdbKey });
        return Promise.all(
          sampleData.map(insertDoc => {
            return new Promise((resolve, reject) => {
              client.createDocument(collLink._self, insertDoc, (err, insertedDoc) => {
                if (err) {
                  reject(err);
                }
                else {
                  resolve(insertedDoc);
                }
              });
            });
          })
        );
      },
      err => { throw err; }
    );
};

