var express = require('express');
var weather = require('./server/api/weather');

var app = express();

var port = 8001;

app.use(express.static('./dst'));

app.get('/api', function(req, res) {
    res.json({
        health: 'healthy'
    });
});
app.get('/api/weather/:lat/:lng', weather.get);

app.listen(port);
console.log(`Listening on port ${port}`);
