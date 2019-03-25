import DS from 'ember-data';
import Service from '@ember/service';
import { computed } from '@ember/object';
import blockstack from 'npm:blockstack';
import { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  authenticate() {
    blockstack.redirectToSignIn(undefined, undefined, ['store_write', 'publish_data', 'email']);
  },

  authenticated: computed(() => {
    return blockstack.isUserSignedIn();
  }),

  deauthenticate() {
    blockstack.signUserOut(window ? window.location.origin : null);
  },

  human: computed('findOrCreateHuman.content', function() {
    return this.get('findOrCreateHuman.content') ? this.get('findOrCreateHuman.content') : this.get('findOrCreateHuman');
  }),

  findOrCreateHuman: computed('authenticated', function() {
    if (!this.get('authenticated')) { return; }

    return DS.PromiseObject.create({
      promise: new Promise((resolve) => {
        this.get('store').findRecord(this.get('blockstackName'), 'human', this.get('userId')).then(resolve).catch(() => {
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

  userId: computed('userData', function() {
    return this.get('userData.identityAddress');
  }),

  blockstackName: computed('userData', function() {
    return this.get('userData.username');
  })
});
