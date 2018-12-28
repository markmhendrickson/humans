import DS from 'ember-data';
import Service from '@ember/service';
import { computed } from '@ember/object';
import blockstack from 'npm:blockstack';
import { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  authenticate() {
    blockstack.redirectToSignIn();
  },

  authenticated: computed(() => {
    return blockstack.isUserSignedIn();
  }),

  deauthenticate() {
    blockstack.signUserOut(window ? window.location.host : null);
  },

  human: computed('authenticated', function() {
    if (!this.get('authenticated')) { return; }

    return DS.PromiseObject.create({
      promise: new Promise((resolve, reject) => {
        this.get('store').findRecord('human', this.get('userId')).then(resolve).catch((error) => {
          this.get('store').unloadRecord(this.get('store').getReference('human', this.get('userId')).internalModel); // fix for https://github.com/locks/ember-localstorage-adapter/issues/219

          resolve(this.get('store').createRecord('human', {
            id: this.get('userId')
          }));
        });
      })
    });
  }),

  unauthenticated: computed(() => {
    return !blockstack.isUserSignedIn();
  }),

  userData: computed(() => {
    return blockstack.loadUserData();
  }),

  userId: computed(function() {
    return this.get('userData.identityAddress');
  })
});
