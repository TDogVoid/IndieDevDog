import { Mongo } from 'meteor/mongo';

export const Tweets = new Mongo.Collection('tweets');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tweets', function tweetsPublication() {
    return Tweets.find();
  });
}

Meteor.methods({
    'RemoveTweet': function(id) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        check(id, String);
        Tweets.remove(id);
    }
});
