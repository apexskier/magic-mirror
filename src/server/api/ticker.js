var Twitter = require('twitter');
var userData = require('../userData');
var Cache = require('../../common/cache');

var apiKeys = require('../../private.js').twitter;

// 5 minute cache
var cache = new Cache(1000 * 60 * 5);
var client = new Twitter(apiKeys);

function get(req, res) {
    cache(function(resolve, reject) {
        // return resolve(mockData);
        client.get('trends/closest', {
            lat: 47.6150436,
            long: -122.1717577
        }, function(error, locations) {
            if (error) reject(error);
            if (!locations || !locations.length) reject();
            client.get('trends/place', {
                id: locations[0].woeid
            }, function(error, trends) {
                if (error) reject(error);
                if (!trends || !trends.length) reject();
                trends = trends[0].trends.filter((tr) => !tr.promoted_content);
                var trend = trends[Math.floor(Math.random() * trends.length)]
                client.get('search/tweets', {
                    q: `${trend.name} -filter:retweets`,
                    result_type: 'popular',
                    lang: 'en'
                }, function(error, tweets) {
                    if (error) reject(error);
                    if (!tweets || !tweets.statuses) reject();
                    resolve(tweets.statuses.filter(tweet => {
                        return (!tweet.entities.media || tweet.entities.media.length === 0) &&
                            (!tweet.entities.urls || tweet.entities.urls.length === 0);
                    }).map(tweet => {
                        return {
                            content: tweet.text,
                            source: `@${tweet.user.screen_name} (${trend.name})`
                        };
                    }));
                });
            });
        });
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

module.exports.get = get;
