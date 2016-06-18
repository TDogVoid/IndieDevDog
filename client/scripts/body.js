import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Tweets} from '../../imports/api/tweets.js';
import './tweet.js';
import '../layouts/body.html';

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('tweets');
});

Template.getTweets.events({
  'click .GetTweets'(event, instance) {
    console.log('getting tweets');
    Meteor.call('GetTweetsMethod');
  },
  'click .ClassifyAll'(event, instance) {
    Meteor.call('ClassifyAll');
  },
  'click .saveFile'(event, instance) {
    Meteor.call('SaveFile');
  },
  'click .Purge'(event, instance){
    Meteor.call('Purge');
  }
});

Template.AddSpamStr.events({
  'submit .new-spam'(event) {
    event.preventDefault();
    const target = event.target;
    const text = target.text.value;
    Meteor.call('AddSpam', text);
    target.text.value = '';
  }
});


Template.homeContent.helpers({
  tweets(){
    return Tweets.find({});
  },
});
