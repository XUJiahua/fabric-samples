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
  "/msp/keystore/d6b8cba2f7943c5d4d95c6ff8f7bdda733a702c85f9f21149e64a866ae8aea54_sk"
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
const chainCodeName = "coupon";

module.exports = {
  identityLabel,
  mspId,
  certPath,
  keyPath,
  walletPath,
  channelName,
  chainCodeName
};
