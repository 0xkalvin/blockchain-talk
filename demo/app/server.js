const express = require('express');
const cors = require('cors');

const { createIdentity } = require('./blockchain-service');
const propertyController = require('./property-controller');
const offerController = require('./offer-controller');

const { 
    PORT,
    IDENTITY_NAME,
    IDENTITY_PASSWORD
}= require('./config');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/properties', propertyController.create);
app.get('/properties/:id', propertyController.show);
app.get('/properties', propertyController.index);
app.post('/offers', offerController.create);
app.patch('/offers/:id', offerController.update);
app.get('/offers/:id', offerController.show);
app.post('/offers/:id/pay', offerController.pay);


const onListening = () => console.info(`Server running on port ${PORT}`);
const startServer = app => app.listen(PORT, onListening);

createIdentity(IDENTITY_NAME, IDENTITY_PASSWORD)
    .then(startServer(app))
    .catch(console.error)