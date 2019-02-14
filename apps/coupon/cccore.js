"use strict";

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require("fs");
const yaml = require("js-yaml");
const { FileSystemWallet, Gateway } = require("fabric-network");
const {
  identityLabel,
  walletPath,
  channelName,
  chainCodeName
} = require("./consts");

// Main program function
async function callChainCode(isReadOnly, ...args) {
  // A gateway defines the peers used to access Fabric networks
  const gateway = new Gateway();

  // Main try/catch block
  try {
    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(
      fs.readFileSync("gateway/network-config.yaml", "utf8")
    );

    // A wallet stores a collection of identities for use
    const wallet = new FileSystemWallet(walletPath);

    // Set connection options; identity and wallet
    let connectionOptions = {
      identity: identityLabel,
      wallet: wallet,
      discovery: { enabled: false, asLocalhost: true }
    };

    // Connect to gateway using application specified parameters
    console.log("Connect to Fabric gateway.");

    await gateway.connect(connectionProfile, connectionOptions);

    // Access business network
    const network = await gateway.getNetwork(channelName);

    // Get addressability to commercial paper contract
    const contract = await network.getContract(chainCodeName);

    if (isReadOnly) {
      console.log("Read from ledger");
      const response = await contract.evaluateTransaction(...args);
      console.log(response.toString());
      return response.toString();
    } else {
      console.log("Write to ledger");
      const response = await contract.submitTransaction(...args);
      console.log(response.toString());
      return response.toString();
    }
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    return "";
  } finally {
    // Disconnect from the gateway
    console.log("Disconnect from Fabric gateway.");
    gateway.disconnect();
  }
}

module.exports = { callChainCode };
