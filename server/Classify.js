import {
    Meteor
} from 'meteor/meteor';
import {
    Tweets
} from '../imports/api/tweets.js';
import {
    DataSets
} from '../imports/api/datasets.js';
import {
    TestStrings
} from '../imports/api/teststrings.js';

export const ClassSpam = 'Spam';
export const ClassHam = 'Ham';
const fs = require('fs');

var natural = require('natural'),
    classifier = new natural.BayesClassifier();

export function ReclassifyAll() {
    Tweets.find({}).forEach(function(tweet) {
        ClassifyUpdate(tweet.text, tweet._id);
    });
    TestStrings.find({}).forEach(function(test) {
        s = classifier.classify(test.text);
        console.log(test.text);
        console.log(classifier.getClassifications(test.text));
        console.log(s);
        TestStrings.update(test._id, {
            $set: {
                classified: s
            }
        });
    });
};

export function GetClassification(str){
    return classifier.classify(str);
}

export function ClassifyUpdate(str, id) {
    s = classifier.classify(str);
    Tweets.update(id, {
        $set: {
            classified: s
        }
    });
};

function trainerArr(arr, type) {
    for (var i = 0; i < arr.length; i++) {
        trainer(arr[i], type);
        DataSets.insert({
            text: arr[i],
            classified: type
        });
    }
};

function trainer(str, type) {
    classifier.addDocument(str, type);
};

function save() {
    classifier.train();
    ReclassifyAll();
    SaveClassifierFile();
};

function SaveClassifierFile() {
    classifier.save('../../../../../public/classifier.json', function(err, c) {
        // the classifier is saved to the classifier.json file!
        if(err){
            console.log(err)
        };
    });
}

function InitTraining() {
    console.log('InitTraining Started');
    var spamArr = require('./DataSet/spam.json');
    trainerArr(spamArr, ClassSpam);

    const readline = require('readline');


    var pattSpam = /^spam\b/;
    var pattHam = /^ham\b/;
    var subst = '';

    const rl = readline.createInterface({
        terminal: false,
        input: fs.createReadStream('../../../../../server/DataSet/SMSSpamCollection.txt')
    });
    var cl = '';
    rl.on('line', function(line) {
        if (pattSpam.test(line)) {
            str = line.replace(pattSpam, subst);
            cl = ClassSpam;
        } else if (pattHam.test(line)) {
            str = line.replace(pattHam, subst);
            cl = ClassHam;
        }
        trainer(str, cl);
        DataSets.insert({
            text: str,
            classified: cl
        });
    });
    rl.close();
    save();
    console.log('InitTraining Done');

};

var Load = function(callback) {
    DataSets.find({}).forEach(function(dataset) {
        trainer(dataset.text, dataset.classified);
    });
    save();
    callback();
};

Meteor.startup(() => {
    if (DataSets.find().count() == 0) {
        InitTraining();
    } else {
        console.log("Loading");
        Load(function() {
            console.log("Loaded");
        });
    }
});



Meteor.methods({
    'AddSpam': function(str) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        check(str, String);
        console.log('added as spam: ' + str);
        trainer(str, ClassSpam);
        DataSets.insert({
            text: str,
            classified: ClassSpam
        });
        save();
    },

    'NotSpam': function(str) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        check(str, String);
        trainer(str, ClassHam);
        DataSets.insert({
            text: str,
            classified: ClassHam
        });

        save();
    },

    'ClassifyAll' () {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        if (this.isSimulation) {
            return;
        }
        ReclassifyAll();
    },

    'SaveFile' () {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        SaveClassifierFile();
    },

    'TestString'(str){
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        check(str, String);
        return GetClassification(str);
    },
    'AddTestString': function(str) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        check(str, String);
        console.log('test string added: ' + str);
        TestStrings.insert({text: str, classified: classifier.classify(str)});
        console.log(TestStrings.find().count());
    }

});
