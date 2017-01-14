const readline = require('readline');
const msRestAzure = require('ms-rest-azure');
const resourceManagement = require('azure-arm-resource');

module.exports.publish = () => {
  console.log('yay azure...');
};

module.exports.listRegions = () => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Your tenant ID [optional]: ', tenantId => {
      msRestAzure.interactiveLogin({ domain: tenantId }, (err, creds, subs) => {
        if (!subs || subs.length === 0) {
          reject(Error('Unable to retrieve subscriptions'));
          rl.close();
          return;
        }
        const client = new resourceManagement.SubscriptionClient(creds);
        client.subscriptions.listLocations(subs[0].id, (err, result, request, response) => {
          if (err) {
            console.log(`Error as follows:\n${err}`);
            rl.close();
            reject(err);
            return;
          }
          // console.log(result);
          console.log(subs);
          rl.close();
          resolve();
        });
      });
    });
  });
};
