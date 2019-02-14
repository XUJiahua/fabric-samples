"use strict";

// Bring key classes into scope, most importantly Fabric SDK network class
const { FileSystemWallet, X509WalletMixin } = require("fabric-network");
const {
  identityLabel,
  mspId,
  certPath,
  keyPath,
  walletPath
} = require("./consts");
const fs = require("fs");

async function main() {
  // Main try/catch block
  try {
    // Load user' cert & key from disk
    const cert = fs.readFileSync(certPath).toString();
    const key = fs.readFileSync(keyPath).toString();
    // Load credentials into wallet
    const identity = X509WalletMixin.createIdentity(mspId, cert, key);

    // A wallet stores a collection of identities
    const wallet = new FileSystemWallet(walletPath);
    await wallet.import(identityLabel, identity);
  } catch (error) {
    console.log(`Error adding to wallet. ${error}`);
    console.log(error.stack);
  }
}

main()
  .then(() => {
    console.log("done");
  })
  .catch(e => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
  });
