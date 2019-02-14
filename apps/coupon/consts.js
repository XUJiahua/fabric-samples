const path = require("path");

// fabric network definition folder, TO modify accordingly
const fixtures = path.resolve(__dirname, "../../first-network-2p1o");
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
  "/msp/keystore/89a6b1a7d54f676b99f27c3ad228b5acf59c76ebf43aa0484d2623dc6efbd4b4_sk"
);

// wallet path, TO modify accordingly
const walletPath = "wallet";

// TO modify accordingly
const identityLabel = "User1@org1.example.com";
// TO modify accordingly
const mspId = "Org1MSP";

// TO modify accordingly
const channelName = "mychannel";
// TO modify accordingly
const chainCodeName = "mycc";

module.exports = {
  identityLabel,
  mspId,
  certPath,
  keyPath,
  walletPath,
  channelName,
  chainCodeName
};
