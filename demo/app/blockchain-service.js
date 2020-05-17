const path = require("path");

/* The actual libraries that allow us to create a wallet and a connection gateway    */
const {
  FileSystemWallet,
  Gateway,
  X509WalletMixin,
} = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");

/*  Loads env variables */
const {
  CA_URL,
  IDENTITY_NAME,
  MSPID,
  DISCOVERY,
  ISLOCAL,
  CHANNEL_NAME,
  CHAINCODE_NAME,
} = require('./config');

/*  Wallet that contains a valid identity to access the blockchain */
const wallet = new FileSystemWallet(path.join("wallet"));

const connectionProfile = require('./connection-profile.json')
/*  This method uses a wallet and a connection profile 
    to establish a gateway connection to the wanted network, returning the network object.  */
function getNetwork() {
  return new Promise(async (resolve, reject) => {
    try {
      const gateway = new Gateway();

      const connectionOptions = {
        identity: IDENTITY_NAME,
        wallet: wallet,
        discovery: {
          enabled: DISCOVERY,
          asLocalhost: ISLOCAL,
        },
      };

      await gateway.connect(connectionProfile, connectionOptions);
      const network = await gateway.getNetwork(CHANNEL_NAME);

      resolve(network);
    } catch (error) {
      reject(error);
    }
  });
}

/* Creates a valid identity to be able to make transactions. Save it into the filesystem wallet  */
function createIdentity(id, secret) {
  return new Promise(async (resolve, reject) => {
    try {
      const ca = new FabricCAServices(CA_URL);

      const alreadyExists = await wallet.exists(id);
      if (alreadyExists) {
        console.log(`An identity ${id} already exists`);
        return;
      }

      console.log("Enrolling identity...");
      const enrollment = await ca.enroll({
        enrollmentID: id,
        enrollmentSecret: secret,
      });
      console.log("Generating a identity...");
      const identity = X509WalletMixin.createIdentity(
        MSPID,
        enrollment.certificate,
        enrollment.key.toBytes()
      );
      console.log("Saving identity...");
      await wallet.import(id, identity);
      console.log("Identity created successfully");
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/*  Finds the smart contract which contains all the transactions to be made   */
async function getContract() {
  return new Promise(async (resolve, reject) => {
    try {
      const network = await getNetwork();
      const contract = await network.getContract(CHAINCODE_NAME);
      resolve(contract);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports.getContract = getContract;
module.exports.getNetwork = getNetwork;
module.exports.createIdentity = createIdentity;


