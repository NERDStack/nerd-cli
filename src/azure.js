const readline = require('readline');
const msRestAzure = require('ms-rest-azure');
const resourceManagement = require('azure-arm-resource');

module.exports.publish = () => {
  return promptForPublishParameters()
    .then(output => {
      console.log(`Location: ${output.location}`);
      console.log(`Web app name: ${output.webAppName}`);
    });
};

function promptForPublishParameters() {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Location (found by running `nerd regions`): ', location => {
      rl.question('Web app name: ', webAppName => {
        rl.close();
        resolve({ webAppName, location });
      });
    });
  });
}

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
            rl.close();
            reject(err);
            return;
          }
          result.forEach(region => {
            console.log(`${region.displayName} (${region.name})`);
          });
          rl.close();
          resolve();
        });
      });
    });
  });
};
