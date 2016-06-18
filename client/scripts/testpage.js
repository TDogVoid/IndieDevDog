import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../layouts/testpage.html';
import {
    TestStrings
} from '../../imports/api/teststrings.js';

Template.testpage.onCreated(function testpageOnCreated() {
  Meteor.subscribe('teststrings');
  console.log('onCreated');
});


Template.testpage.helpers({
  teststrings(){
    return TestStrings.find({});
  },
});

Template.testpage.events({
  'submit .Add-test-string'(event){
    event.preventDefault();
    const target = event.target;
    const text = target.text.value;
    Meteor.call('AddTestString', text);
    target.text.value = '';
  }

});

Template.teststring.events({
  'click .MarkSpam' (event, instance) {
        Meteor.call('AddSpam', this.text);
  },
  'click .Remove' (event, instance) {
        Meteor.call("RemoveTestString", this._id);
    }
});
