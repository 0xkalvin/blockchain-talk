

module.exports = (sockets) => {
    sockets.on('connection', socket => {
        console.log(`Client ${socket.id} has connected`);

        const block = {
            id: '7826538475638475',
        }

        sockets.emit('new-block', block)
    })
}