var express = require('express');
// var calendar = require('./server/api/calendar');
var weather = require('./server/api/weather');
var ticker = require('./server/api/ticker');
var http = require('http');
var morgan = require('morgan');

var clientPort = 8101;
var internalPort = 8102;
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
    socket.on('tracking', function(msg) {
        io.of('/client').emit('tracking', msg);
    });
    socket.on('disconnect', function() {
        console.log('vision disconnected');
    });
});
app.use(express.static('./dst'));

// External server
var externalApp = express();
externalApp.use(morgan('tiny'));

var externalServer = http.Server(externalApp);

// Internal Server
var internalApp = express();
internalApp.use(morgan('tiny'));

var internalServer = http.Server(internalApp);

internalApp.get('/', function(req, res) {
    res.json({
        health: 'healthy'
    });
});
internalApp.all('/activate', function(req, res) {
    io.of('/client').emit('activate');
    res.status(202).json(true);
});
internalApp.all('/state', function(req, res) {
    io.of('/client').emit('switchState', {to: 'center'});
    res.status(202).json(true);
});
internalApp.all('/state/:state', function(req, res) {
    var state = req.params.state;
    // allowed states
    if (['center', 'right'].indexOf(state) > -1) {
        io.of('/client').emit('switchState', {to: state});
        res.status(202).json(false);
    } else {
        res.status(400).json(false);
    }
});
internalApp.all('/gesture/:direction', function(req, res) {
    var dir = req.params.direction;
    // allowed directions
    if (['left', 'right', 'up', 'down'].indexOf(dir) > -1) {
        io.of('/client').emit('gesture', {direction: dir});
        res.status(202).json(false);
    } else {
        res.status(400).json(false);
    }
});

server.listen(clientPort);
externalServer.listen(externalPort);
internalServer.listen(internalPort);

console.log(`Listening on port ${clientPort} (client)`);
console.log(`Listening on port ${externalPort} (external)`);
console.log(`Listening on port ${internalPort} (internal)`);
