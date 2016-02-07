var io = require('socket.io-client');

var socket = io.connect('http://localhost:8101/client');
socket.on('ping', function(data) {
    if (data === 'ping') {
        socket.emit('ping', 'pong');
    }
});

module.exports = socket;
