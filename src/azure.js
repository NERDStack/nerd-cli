const readline = require('readline');
const msRestAzure = require('ms-rest-azure');
const resourceManagement = require('azure-arm-resource');

module.exports.publish = () => {
  let outputCached;
  return promptForPublishParameters()
    .then(output => {
      outputCached = output;
      return auth(output.tenantId);
    })
    .then(auth =>
      createResourceGroup(auth, outputCached))
    .then(() => console.log('created resource group'))
    .catch(err => console.log(err.message));
};

function auth(tenantId) {
  return new Promise((resolve, reject) => {
    msRestAzure.interactiveLogin({ domain: tenantId }, (err, credentials, subscriptions) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ credentials, subscriptions });
    });
  });
}

function createResourceGroup(auth, options) {
  return new Promise((resolve, reject) => {
    const client = new resourceManagement.ResourceManagementClient(auth.credentials, auth.subscriptions[0].id);
    client.resourceGroups.createOrUpdate(
      // currently we will name the resource group the same name as the web app
      options.name,
      { location: options.location },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
}

function promptForPublishParameters() {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Tenant ID (optional): ', tenantId => {
      rl.question('Location (found by running `nerd regions`): ', location => {
        rl.question('Web app name: ', name => {
          rl.close();
          resolve({ tenantId, name, location });
        });
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
        client.subscriptions.listLocations(subs[0].id, (err, result) => {
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
