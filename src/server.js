var express = require('express');
// var calendar = require('./server/api/calendar');
var weather = require('./server/api/weather');
var ticker = require('./server/api/ticker');

var app = express();

var port = 8101;

app.use(express.static('./dst'));

app.get('/api', function(req, res) {
    res.json({
        health: 'healthy'
    });
});
app.get('/api/weather/:lat/:lng', weather.get);
app.get('/api/ticker', ticker.get);
// app.get('/api/calendar/events', calendar.get);

app.listen(port);
console.log(`Listening on port ${port}`);
