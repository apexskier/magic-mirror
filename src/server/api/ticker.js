var Twitter = require('twitter');
var Cache = require('../../common/cache');

var apiKeys = require('../../private.js').twitter;

// 5 minute cache
var cache = new Cache(1000 * 60 * 5);
var client = new Twitter(apiKeys);

var hashtag = '#dadjokes';

function get(req, res) {
    cache(function(resolve, reject) {
        // return resolve(mockData);
        client.get('search/tweets', {
            q: `${hashtag} -filter:retweets`,
            // result_type: 'popular',
            lang: 'en'
        }, function(error, tweets) {
            if (error) reject(error);
            if (!tweets || !tweets.statuses) reject();
            resolve(tweets.statuses/* .filter(tweet => {
                return (!tweet.entities.media || tweet.entities.media.length === 0) &&
                    (!tweet.entities.urls || tweet.entities.urls.length === 0);
            })*/.map(tweet => {
                return {
                    content: tweet.text,
                    source: `@${tweet.user.screen_name}`
                };
            }));
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
