import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Tweets} from '../../imports/api/tweets.js';
import './tweet.js';
import '../layouts/body.html';

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('tweets');
});



Template.addTwitterAccountTraining.onCreated(function bodyOnCreated() {
  this.hamTwitterAccount = new ReactiveVar(null);
  this.spamTwitterAccount = new ReactiveVar(null);
});


Template.addTwitterAccountTraining.helpers({
  HamTwitterAccount: function(){
    return Template.instance().hamTwitterAccount.get();
  },
  SpamTwitterAccount: function(){
    return Template.instance().spamTwitterAccount.get();
  }
});

Template.addTwitterAccountTraining.events({
  'submit .AddTwitterAccountHam'(event, template) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    Meteor.call("AddTwitterAccountHam", text, function(error, str){
      if(error) return;
      console.log(str);
      template.hamTwitterAccount.set(str + " Account Tweets Added as ham");
    });
    // Clear form
    target.text.value = '';
  },
  'submit .AddTwitterAccountSpam'(event, template) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    Meteor.call("AddTwitterAccountSpam", text, function(error, str){
      if(error) return;
      template.spamTwitterAccount.set(str + " Account Tweets Added as spam");
    });
    // Clear form
    target.text.value = '';
  }
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
