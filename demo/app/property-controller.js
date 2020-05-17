const blockchainService = require('./blockchain-service');

const create = async (req, res) => {
    try {
        const payload = req.body;

        const contract = await blockchainService.getContract();
        const result = await contract.submitTransaction('createProperty', JSON.stringify(payload));

        return res.send(result);

    } catch (error) {
     console.error(error);
     return res.status(500).send({ error: true });   
    }
}

const index = async (req, res) => {
    try {
        const contract = await blockchainService.getContract();
        const properties = await contract.evaluateTransaction('getAllProperties'); 
        return res.send(properties);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: true });   
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const contract = await blockchainService.getContract();
        const property = await contract.evaluateTransaction('getHistory', 'PROPERTY', id); 
        return res.send(property);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: true });   
    }
}


module.exports.create = create;
module.exports.index = index;
module.exports.show = show;

