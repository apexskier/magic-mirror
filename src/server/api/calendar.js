var iCloud = require('../icloud');
var iCloudConnection = iCloud('cameron@camlittle.com', 'KayaKing@010');

function get(req, res) {
    iCloudConnection.testing().then(function(data) {
        res.json({
            status: 'success',
            data: data
        });
    });
}

module.exports.get = get;
