const readline = require('readline');
const exec = require('child_process').exec;
const msRestAzure = require('ms-rest-azure');
const resourceManagement = require('azure-arm-resource');
const webSiteManagement = require('azure-arm-website');
const configManagement = require('./config');
const util = require('./apputil');

module.exports.publish = () => {
  let outputCached;
  let authCached;
  return promptForPublishParameters()
    .then(output => {
      outputCached = output;
      // {
      //  tenantId,
      //  name,
      //  resourceGroupName,
      //  location,
      //  documentdbUri,
      //  documentdbKey
      // }
      return auth(output.tenantId);
    })
    .then(auth => {
      authCached = auth;
      return createResourceGroup(auth, outputCached);
    })
    .then(() => util.displayInfo(`Resource group ${outputCached.resourceGroupName} created`))
    .then(() => createWebApp(authCached, outputCached))
    .then(() => util.displayInfo(`Web app ${outputCached.name} created`))
    .then(() => enableGitPushDeploy(authCached, outputCached))
    .then(() => util.displayInfo('Local git deployment to Azure App Service enabled'))
    .then(() => setAppSettings(authCached, outputCached))
    .then(() => util.displayInfo('App Service environment variables for DocumentDB connection created'))
    .then(() => fixGitRemotes(outputCached.name))
    .then(() => util.displayInfo('Local git repo remotes changed'))
    .then(() => displayGitCredentialsMessage())
    .catch(err => util.displayError(err));
};

function getTenantIdFromConfig() {
  return configManagement.loadConfig()
    .then(config => config.tenantId)
    .catch(() => '');
}

function saveTenantIdToConfig(tenantId) {
  return configManagement.loadConfig()
    .then(config => Object.assign(config, { tenantId }))
    .then(config => configManagement.saveConfig(config));
}

function auth(tenantId) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    msRestAzure.interactiveLogin({ domain: tenantId }, (err, credentials, subscriptions) => {
      if (err) {
        reject(err);
        return;
      }

      // Assumption, we'll only ever need the selected subscription
      displayChooseAzureSubscriptionMessage(subscriptions);

      rl.question('Type the number of the subscription: ', subscriptionId => {
        let id = subscriptionId ? (parseInt(subscriptionId)-1) : 0;
        let subscription = subscriptions[id];
        resolve({ credentials, subscription });
      })
    });
  });
}

function displayChooseAzureSubscriptionMessage(subscriptions) {
  util.displayAction('Which Azure Subscription would you like to deploy to?');
  
  for (var i = 0; i < subscriptions.length; i++) {
    util.displayAction(`${i+1}. ${subscriptions[i].name}`);
  }
}

function displayGitCredentialsMessage() {
  util.displayAction('First time with local git deployment to Azure App Service?');
  util.displayAction(' 1. In your browser, navigate to https://portal.azure.com');
  util.displayAction(' 2. Find your web app resource group and navigate to it');
  util.displayAction(' 3. Click on the App Service in your resource group');
  util.displayAction(' 4. Navigate to the `Deployment credentials` section');
  util.displayAction(' 5. Add/change your git deployment credentials and save');
}

function fixGitRemotes(webAppName) {
  return new Promise((resolve, reject) => {
    exec('git remote remove origin', err => {
      if (err) {
        reject(err);
        return;
      }
      exec(`git remote add azure https://${webAppName}.scm.azurewebsites.net:443/${webAppName}.git`, err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

function enableGitPushDeploy(auth, options) {
  return new Promise((resolve, reject) => {
    const client = new webSiteManagement(auth.credentials, auth.subscription.id);
    client.sites.updateSiteConfig(
      options.resourceGroupName,
      options.name,
      {
        scmType: 'LocalGit',
        location: options.location,
        remoteDebuggingEnabled: true
      },
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

function setAppSettings(auth, options) {
  return new Promise((resolve, reject) => {
    const client = new webSiteManagement(auth.credentials, auth.subscription.id);
    client.sites.updateSiteAppSettings(
      options.resourceGroupName,
      options.name,
      {
        location: options.location,
        properties: {
          DOCUMENTDB_URI: options.documentdbUri,
          DOCUMENTDB_KEY: options.documentdbKey,
          WEBSITE_NODE_DEFAULT_VERSION: '6.9.1'
        }
      },
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

function createWebApp(auth, options) {
  return new Promise((resolve, reject) => {
    const client = new webSiteManagement(auth.credentials, auth.subscription.id);
    client.sites.createOrUpdateSite(
      options.resourceGroupName,
      options.name,
      {
        siteName: options.name,
        location: options.location
      },
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

function createResourceGroup(auth, options) {
  return new Promise((resolve, reject) => {
    const client = new resourceManagement.ResourceManagementClient(auth.credentials, auth.subscription.id);
    client.resourceGroups.createOrUpdate(
      // currently we will name the resource group the same name as the web app
      options.resourceGroupName,
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
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let parentTenantId;
  let parentLocation;
  let parentDocumentdbUri;
  let parentDocumentdbKey;
  let parentResourceGroupName;

  return getTenantIdFromConfig()
    .then(tenantId =>
      new Promise(resolve => {
        rl.question(`(optional) Tenant ID [default: ${tenantId ? tenantId : 'none'}]: `, inputTenantId => {
          if (inputTenantId) {
            // user inputed a tenant id, so this is now the tenantId and we should cache it
            parentTenantId = inputTenantId;
            resolve(inputTenantId);
          }
          else if (!inputTenantId && tenantId) {
            // user did not input a tenant id and an actual one was cached
            parentTenantId = tenantId;
            resolve(tenantId);
          }
          else {
            // no inputed tenant id and no cached one
            parentTenantId = '';
            resolve();
          }
        });
      })
    )
    .then(tenantId => {
      if (tenantId) {
        saveTenantIdToConfig(tenantId);
      }
    })
    .then(() => new Promise(resolve => {
      rl.question('DocumentDB URI: ', documentdbUri => {
        parentDocumentdbUri = documentdbUri;
        resolve();
      });
    }))
    .then(() => new Promise(resolve => {
      rl.question('DocumentDB key: ', documentdbKey => {
        parentDocumentdbKey = documentdbKey;
        resolve();
      });
    }))
    .then(() => new Promise(resolve => {
      rl.question('Location (found by running `nerd regions`): ', location => {
        parentLocation = location;
        resolve();
      });
    }))
    .then(() => new Promise (resolve => {
      rl.question('Resource group name (will be created if doesn\'t exist): ', resourceGroupName => {
        parentResourceGroupName = resourceGroupName;
        resolve();
      });
    }))
    .then(() => new Promise(resolve => {
      rl.question('Web app name: ', name => {
        rl.close();
        resolve({
          tenantId: parentTenantId,
          name,
          resourceGroupName: parentResourceGroupName,
          location: parentLocation,
          documentdbUri: parentDocumentdbUri,
          documentdbKey: parentDocumentdbKey
        });
      });
    }));
}

module.exports.listRegions = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let parentTenantId;

  return getTenantIdFromConfig()
    .then(tenantId =>
      new Promise(resolve => {
        rl.question(`(optional) Tenant ID [default: ${tenantId ? tenantId : 'none'}]: `, inputTenantId => {
          if (inputTenantId) {
            // user inputed a tenant id, so this is now the tenantId and we should cache it
            parentTenantId = inputTenantId;
            resolve(inputTenantId);
          }
          else if (!inputTenantId && tenantId) {
            // user did not input a tenant id and an actual one was cached
            parentTenantId = tenantId;
            resolve(tenantId);
          }
          else {
            // no inputed tenant id and no cached one
            parentTenantId = '';
            resolve();
          }
        });
      })
    )
    .then(tenantId => {
      if (tenantId) {
        saveTenantIdToConfig(tenantId);
      }
    })
    .then(() => new Promise((resolve, reject) => {
      msRestAzure.interactiveLogin({ domain: parentTenantId }, (err, creds, subs) => {
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
    }));
};
