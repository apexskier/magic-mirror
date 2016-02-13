var express = require('express');
// var calendar = require('./server/api/calendar');
var weather = require('./server/api/weather');
var ticker = require('./server/api/ticker');
var http = require('http');
var morgan = require('morgan');

var clientPort = 8101;
var externalPort = 8103;

// Client server
var app = express();
app.use(morgan('tiny', {
    skip: function(req) {
        return req.originalUrl.startsWith('/socket.io');
    }
}));

var server = http.Server(app);
var io = require('socket.io')(server);

app.get('/api', function(req, res) {
    res.json({
        health: 'healthy'
    });
});
app.get('/api/weather/:lat/:lng', weather.get);
app.get('/api/ticker', ticker.get);
// app.get('/api/calendar/events', calendar.get);

io.of('/client').on('connection', function(socket) {
    console.log('client connection established');
    socket.on('disconnect', function() {
        console.log('client disconnected');
    });
    socket.emit('ping', 'ping');
});
io.of('/vision').on('connection', function(socket) {
    console.log('vision connection established');
    socket.on('faces', function(data) {
        io.of('/client').emit('activate');
        io.of('/client').emit('faces', data);
    });
    socket.on('gesture', function(data) {
        io.of('/client').emit('gesture', data);
    });
    socket.on('disconnect', function() {
        console.log('vision disconnected');
    });
    // io.of('/client').emit('switchState', {to: state});
});
app.use(express.static('./dst'));

// External server
var externalApp = express();
externalApp.use(morgan('tiny'));

var externalServer = http.Server(externalApp);

server.listen(clientPort);
externalServer.listen(externalPort);

console.log(`Listening on port ${clientPort} (client)`);
console.log(`Listening on port ${externalPort} (external)`);
