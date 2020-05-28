const blockchainService = require('./blockchain-service');

const create = async (req, res) => {
    try {
        const payload = req.body;
        const contract = await blockchainService.getContract();
        const result = await contract.submitTransaction('createOffer', JSON.stringify(payload));

        return res.send(result);

    } catch (error) {
     console.error(error);
     return res.status(500).send({ error: true });   
    }
}

const update = async (req, res) => {
    try {
        const { whos_signing } = req.body;
        const { id } = req.params;

        if(whos_signing !== 'Seller' && whos_signing !== 'Buyer'){
            throw new Error('Unknown signer');
        }
    
        const transactionName = `add${whos_signing}Signature`;
        const contract = await blockchainService.getContract();
        const result = await contract.submitTransaction(transactionName, id);

        return res.send(result);

    } catch (error) {
        console.error({ 
            error,
            payload: error.payload ? error.payload.toString() : null,
            payload: error.peer || null,

        });
     return res.status(500).send({ error: true });   
    }
}

const pay = async (req, res) => {
    try {
        const { id } = req.params;

        const contract = await blockchainService.getContract();
        const result = await contract.submitTransaction('payOffer', id);

        return res.send(result);

    } catch (error) {
        console.error({ 
            error,
            payload: error.payload ? error.payload.toString() : null,
            payload: error.peer || null,

        });
     return res.status(500).send({ error: true });   
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const contract = await blockchainService.getContract();
        const result = await contract.submitTransaction('getHistory', 'OFFER', id);

        return res.send(result);

    } catch (error) {
        console.error({ 
            error,
            payload: error.payload ? error.payload.toString() : null,
            payload: error.peer || null,

        });
     return res.status(500).send({ error: true });   
    }
}

module.exports.create = create;
module.exports.update = update;
module.exports.pay = pay;
module.exports.show = show;



