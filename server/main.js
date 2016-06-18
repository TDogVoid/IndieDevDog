import {
    Meteor
} from 'meteor/meteor';
import '../imports/startup/accounts-config.js';
import {
    Tweets
} from '../imports/api/tweets.js';
import {
    ReclassifyAll,
    ClassHam
} from './Classify.js';
import {
    GetTweets,
    TweetPurge,
    PostRetweet
} from './tweetapi.js';

function randomInRange(min, max) {
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
}

function GetRandomTweet(callback) {
    var tcount = Tweets.find({classified: ClassHam}).count();
    if (tcount > 0) {
        var r = randomInRange(0, tcount);
        var RandomTweet = Tweets.findOne({classified: ClassHam}, {skip: r});
        if (RandomTweet != null) {
            return callback(RandomTweet);
        }
    }
    return callback(null);
}

export function Retweet() {
    TweetPurge();

    GetTweets(function() {
        GetRandomTweet(function(RandomTweet) {
            console.log("RT: " + RandomTweet.text);
            //PostRetweet(RandomTweet.id_str); //untested
        });
    });
}

Meteor.methods({
    'GetTweetsMethod': function() {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        GetTweets(function() {
            //do nothing
        });

    },

    'Purge': function() {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        TweetPurge();
    }
});


Meteor.startup(() => {
    // code to run on server at startup
});
