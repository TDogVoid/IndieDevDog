import { Accounts } from 'meteor/accounts-base';

if (!Meteor.isServer) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  });
}
Accounts.config({
  forbidClientAccountCreation: true,
});
