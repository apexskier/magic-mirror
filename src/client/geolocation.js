// TODO: implement cacheing

var promise = new Promise(function(resolve, reject) {
    if (navigator.geolocation) {
        console.log('Getting location');
        navigator.geolocation.getCurrentPosition(function success(position) {
            console.log('Got location');
            resolve(position.coords);
        }, function error(err) {
            reject(err.message || err || 'Geolocation failed');
        });
    } else {
        reject('Geolocation not supported.');
    }
});

module.exports = promise;
