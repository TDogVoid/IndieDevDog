import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating'
import { Blaze } from 'meteor/blaze'
import '../layouts/tweet.html';
import {
    Tweets
} from '../../imports/api/tweets.js';


Template.tweet.helpers({
    getImage: function(){
        if(this.entities.media){
            s = this.entities.media["0"].media_url_https;
             return s
        };
        return "";
    },
});

Template.tweet.events({
    'click .MarkSpam' (event, instance) {
        Meteor.call('AddSpam', this.text);
        Meteor.call("RemoveTweet", this._id);
    },
    'click .MarkNotSpam' (event, instance) {
        Meteor.call('NotSpam', this.text);
        Meteor.call("RemoveTweet", this._id);
    },
    'click .Remove' (event, instance) {
        Meteor.call("RemoveTweet", this._id);
    },
    'click .AddTestString'(event, instance) {
        Meteor.call("AddTestString", this.text);
    },
});
