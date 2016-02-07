var express = require('express');
// var calendar = require('./server/api/calendar');
var weather = require('./server/api/weather');
var ticker = require('./server/api/ticker');
var http = require('http');
var morgan = require('morgan');

var externalPort = 8101;
var internalPort = 8102;

// External server
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

io.on('connection', function(socket) {
    socket.emit('ping', 'ping');
});
app.use(express.static('./dst'));

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
    io.sockets.emit('activate');
    res.status(202).json(true);
});
internalApp.all('/state', function(req, res) {
    io.sockets.emit('switchState', {to: 'center'});
    res.status(202).json(true);
});
internalApp.all('/state/:state', function(req, res) {
    var state = req.params.state;
    // allowed states
    if (['center', 'right'].indexOf(state) > -1) {
        io.sockets.emit('switchState', {to: state});
        res.status(202).json(false);
    } else {
        res.status(400).json(false);
    }
});
internalApp.all('/gesture/:direction', function(req, res) {
    var dir = req.params.direction;
    // allowed directions
    if (['left', 'right', 'up', 'down'].indexOf(dir) > -1) {
        io.sockets.emit('gesture', {direction: dir});
        res.status(202).json(false);
    } else {
        res.status(400).json(false);
    }
});

server.listen(externalPort);
internalServer.listen(internalPort);

console.log(`Listening on port ${externalPort} (external)`);
console.log(`Listening on port ${internalPort} (internal)`);
