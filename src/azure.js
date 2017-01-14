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
    rl.question('Your subscription ID: ', subscriptionId => {
      if (!subscriptionId) {
        rl.close();
        reject(Error('No input detected'));
        return;
      }
      rl.question('Your tenant ID [optional]: ', tenantId => {
        console.log(`Subscription ID is ${subscriptionId}`);
        if (tenantId) {
          console.log(`Tenant ID is ${tenantId}`);
        }
        else {
          console.log('No tenant ID inputed');
        }

        msRestAzure.interactiveLogin({ domain: tenantId }, (err, creds, subs) => {
          const client = new resourceManagement.SubscriptionClient(creds);
          client.subscriptions.listLocations(subscriptionId, (err, result, request, response) => {
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
  });
};
