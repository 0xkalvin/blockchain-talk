

module.exports =  {
    CA_URL: process.env.CA_URL || 'http://localhost:17050',
    IDENTITY_NAME: process.env.IDENTITY_NAME || 'admin',
    IDENTITY_PASSWORD: process.env.IDENTITY_PASSWORD || 'adminpw',
    MSPID: process.env.MSPID || 'Org1MSP',
    DISCOVERY: process.env.DISCOVERY || true,
    ISLOCAL: process.env.ISLOCAL || true,
    CHANNEL_NAME: process.env.CHANNEL_NAME || 'mychannel',
    CHAINCODE_NAME: process.env.CHAINCODE_NAME || 'chaincode',

    PORT: process.env.PORT || 3000,
};
  