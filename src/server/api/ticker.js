var Twitter = require('twitter');
var Cache = require('../../common/cache');

var apiKeys = require('../../private.js').twitter;

// 5 minute cache
var tweetCache = new Cache(1000 * 60 * 5);
var trendCache = new Cache(1000 * 60 * 60); // every hour
var client = new Twitter(apiKeys);

function get(req, res) {
    tweetCache(function(resolve) {
        resolve(trendCache(function(resolve, reject) {
            // return resolve(mockData);
            client.get('trends/closest', {
                lat: 47.6150436,
                long: -122.1717577
            }, function(error, locations) {
                if (error) return reject(error);
                if (!locations) return reject();
                client.get('trends/place', {
                    id: locations[0].woeid
                }, function(error, trends) {
                    if (error) return reject(error);
                    if (!trends) return reject();
                    trends = trends[0].trends.filter((tr) => !tr.promoted_content);
                    shuffle(trends);
                    resolve(trends);
                });
            });
        }).then(function(trends) {
            return new Promise(function(resolve, reject) {
                (function getTrends(i) {
                    var trend = trends[i];
                    client.get('search/tweets', {
                        q: `${trend.name} -filter:retweets`,
                        result_type: 'popular',
                        lang: 'en'
                    }, function(error, tweets) {
                        if (error) return reject(error);
                        if (!tweets || !tweets.statuses) return reject();
                        var results = tweets.statuses.filter(tweet => {
                            return (!tweet.entities.media || tweet.entities.media.length === 0) &&
                                (!tweet.entities.urls || tweet.entities.urls.length === 0);
                        }).map(tweet => {
                            return {
                                content: tweet.text,
                                source: `@${tweet.user.screen_name} (${trend.name})`
                            };
                        });
                        if (results.length > 1) resolve(results);
                        else if (i < trends.length) getTrends(i + 1);
                        else reject();
                    });
                })(0);
            });
        }));
    }).then(function(data) {
        res.json({
            status: 'success',
            data: data
        });
    }).catch(function(data) {
        res.status(500).json({
            status: 'error',
            data: data
        });
    });
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

module.exports.get = get;
