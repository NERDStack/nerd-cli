const DocumentClient = require('documentdb').DocumentClient;

module.exports.createCollection = (documentdbUri, documentdbKey, dbName, collName) => {
  return new Promise((resolve, reject) => {
    const client = new DocumentClient(documentdbUri, { masterKey: documentdbKey });

    client.createDatabase({ id: dbName }, (err, database) => {
      if (err) {
        reject(err);
      }
      else {
        client.createCollection(database._self, { id: collName }, (err, collection) => {
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

