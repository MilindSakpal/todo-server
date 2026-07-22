const { ConfidentialClientApplication } = require("@azure/msal-node");
const { Client } = require("@microsoft/microsoft-graph-client");
require("isomorphic-fetch");

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

async function getGraphClient() {
  const response = await cca.acquireTokenByClientCredential({
    scopes: ["https://graph.microsoft.com/.default"],
  });

  return Client.init({
    authProvider: (done) => {
      done(null, response.accessToken);
    },
  });
}

module.exports = {
  getGraphClient,
};