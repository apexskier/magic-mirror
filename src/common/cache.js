function Cache(time) {
    var single = null;
    cache.time = time;
    var lastUpdated = {};
    var value = {};
    var working = {};

    cache.clear = clear;

    return cache;

    function clear(key) {
        if (!key) key = 'key';
        if (working) {
            working.then(d => {
                delete lastUpdated[key];
                return d;
            }).catch(() => {
                delete lastUpdated[key];
            });
        } else {
            delete lastUpdated[key];
        }
    }

    function cache(key, dataCallback) {
        if (!dataCallback) {
            dataCallback = key;
            key = 'key';
            if (single === null) {
                single = true;
            } else if (!single) {
                throw new Error('Accessing single cache as multiple');
            }
        } else {
            if (single === null) {
                single = false;
            } else if (single) {
                throw new Error('Accessing multiple cache as single');
            }
        }

        if (!lastUpdated[key]) lastUpdated[key] = 0;

        if (working[key]) return working[key];

        var now = (new Date()).getTime();
        working[key] = new Promise(function(resolve) {
            if (now - lastUpdated[key] > cache.time) {
                resolve(new Promise(dataCallback).then(v => {
                    value[key] = v;
                    lastUpdated[key] = (new Date()).getTime();
                    return v;
                }));
            } else {
                resolve(value[key]);
            }
        }).then(v => {
            working[key] = null;
            return v;
        });

        return working[key];
    }
}

module.exports = Cache;
