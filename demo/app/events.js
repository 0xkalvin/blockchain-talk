const { getNetwork } = require('./blockchain-service');

const runListener = async () => {

    const network = await getNetwork();
    const listener = await network.addBlockListener('my-block-listener', (error, block) => {
        if (error) {
            console.error(error);
            return;
        }
        const blockAsString = JSON.stringify(block, null, 2)
        console.log(blockAsString);

    });
} 


runListener()