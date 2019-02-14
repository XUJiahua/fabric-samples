const path = require("path");

// fabric network definition folder, TO modify accordingly
const fixtures = path.resolve(__dirname, "../../basic-network");
// Identity to credentials to be stored in the wallet
const credPath = path.join(
  fixtures,
  // TO modify accordingly
  "/crypto-config/peerOrganizations/org1.example.com/users/User1@org1.example.com"
);
const certPath = path.join(
  credPath,
  // TO modify accordingly
  "/msp/signcerts/User1@org1.example.com-cert.pem"
);
const keyPath = path.join(
  credPath,
  // TO modify accordingly
  "/msp/keystore/c75bd6911aca808941c3557ee7c97e90f3952e379497dc55eb903f31b50abc83_sk"
);

// wallet path, TO modify accordingly
const walletPath = "wallet";

// TO modify accordingly
const identityLabel = "User1@org1.example.com";
// TO modify accordingly
const mspId = "Org1MSP";

// TO modify accordingly
const channelId = "";
// TO modify accordingly
const contractName = "";

module.exports = { identityLabel, mspId, certPath, keyPath, walletPath };
