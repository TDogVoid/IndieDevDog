import {
    Meteor
} from 'meteor/meteor';
import {
    Retweet
} from './main.js';

if (Meteor.isServer) {
    SyncedCron.config({
        // Log job run details to console
        log: true,

        // Use a custom logger function (defaults to Meteor's logging package)
        logger: null,

        // Name of collection to use for synchronisation and logging
        collectionName: 'cronHistory',

        // Default to using localTime
        utc: false,

        /*
          TTL in seconds for history records in collection to expire
          NOTE: Unset to remove expiry but ensure you remove the index from
          mongo by hand

          ALSO: SyncedCron can't use the `_ensureIndex` command to modify
          the TTL index. The best way to modify the default value of
          `collectionTTL` is to remove the index by hand (in the mongo shell
          run `db.cronHistory.dropIndex({startedAt: 1})`) and re-run your
          project. SyncedCron will recreate the index with the updated TTL.
        */
        collectionTTL: 172800
    });
}

SyncedCron.add({
    name: 'Retweeting',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.recur().every(10).minute();
    },
    job: function(intendedAt) {
        Retweet();
    }
});

Meteor.startup(function() {
    // code to run on server at startup
    //SyncedCron.start(); //not in use yet due to this isn't currently running 24/7
});

Meteor.methods({
    'TurnOnRetweets':function(){
        SyncedCron.start();
    },

    'TurnOffRetweets':function(){
        SyncedCron.pause();
    }
});
