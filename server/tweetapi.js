import TwitClient from './twitterConfig.js';
import {
    Tweets
} from '../imports/api/tweets.js';

import {
    ClassifyUpdate
} from './Classify.js';

var searchQuery = '#indiedev OR #gamedev -RT';

var useLastID = true;  // for turning off in the future

export function TweetPurge(){
    Tweets.remove({});
}

function GetLastID(callback) {
    if(!useLastID){
        return callback(null); // should be fine to null but untested
    }
    TwitClient.get('statuses/user_timeline', {
        user_id: "720274838573621249",
        count: 1
    }, Meteor.bindEnvironment(function(error, reply) {
        if(reply[0] == undefined || error) return callback(null);
        return callback(reply[0].id_str);
    }));
}
export function GetTweets(callback) {
    GetLastID(function(lastID) {
        SearchTwitter(lastID, function() {
            callback();
        });
    });
}

export function PostRetweet(id_str){
    TwitClient.post('statuses/retweet/:id', { id: id_str }, function (err, data, response) {
});
}

function SearchTwitter(lastID, callback) {
    TwitClient.get('search/tweets', {
        q: searchQuery,
        count: 100,
        lang: 'en',
        result_type: 'recent',
        show_all_inline_media: 'true',
        since_id: lastID
    }, Meteor.bindEnvironment(function(error, reply) {
        if (error) return console.log(error);

        var tweets = reply.statuses;

        for (var i = 0; i < tweets.length; i++) {
            Tweets.insert(tweets[i]);
            var id = Tweets.findOne({
                text: tweets[i].text
            })._id;
            ClassifyUpdate(tweets[i].text, id);
        }
        callback();
    }));
}

export function GetTweetsAccount(username,callback){
    TwitClient.get('statuses/user_timeline', {
        screen_name: username,
        count: 200,
        include_rts: false
    }, Meteor.bindEnvironment(function(error, reply) {
        if (error) return console.log(error);

        var TweetsText = [];

        for (var i = 0; i < reply.length; i++) {
            TweetsText.push(reply[i].text);
        }
        callback(TweetsText);
    }));
}
