const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const { createIdentity } = require('./blockchain-service');
const propertyController = require('./property-controller.js.js');
const offerController = require('./offer-controller');
const setupSockets = require('./sockets');

const { 
    PORT,
    IDENTITY_NAME,
    IDENTITY_PASSWORD
}= require('./config');

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

app.use(cors());
app.use(express.json());
app.use(express.static('./'));

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
    .then(startServer(server))
    .then(setupSockets(sockets))
    .catch(console.error)