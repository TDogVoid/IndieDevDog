import { Mongo } from 'meteor/mongo';

export const TestStrings = new Mongo.Collection('teststrings');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('teststrings', function teststringsPublication() {
    return TestStrings.find();
  });
}

Meteor.methods({
    'RemoveTestString': function(id) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        check(id, String);
        TestStrings.remove(id);
    }
});
