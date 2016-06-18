var Twit = require('twit');
export default TwitClient = new Twit({
  consumer_key: Meteor.settings.twitter.consumer_key,
  consumer_secret: Meteor.settings.twitter.consumer_secret,
  access_token: Meteor.settings.twitter.access_token,
  access_token_secret: Meteor.settings.twitter.access_token_secret,
  timeout_ms:           60*1000 // optional HTTP request timeout to apply to all requests.
});
