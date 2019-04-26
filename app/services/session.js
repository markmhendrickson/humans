import Service from '@ember/service';
import { computed } from '@ember/object';
import blockstack from 'blockstack';
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
    blockstack.signUserOut((window && window.location) ? window.location.origin : null);
  },

  generateHuman() {
    return new Promise((resolve, reject) => {
      if (!this.get('authenticated')) { return reject(); }

      this.store.findRecord(this.get('blockstackName'), 'human', this.get('userId')).then((human) => {
        this.set('human', human);
        resolve(human);
      }).catch(() => {
        let human = this.get('store').createRecord('human', {
          id: this.get('userId')
        });

        this.set('human', human);
        resolve(human);
      });
    });
  },

  unauthenticated: computed(() => {
    return !blockstack.isUserSignedIn();
  }),

  userData: computed('authenticated', function() {
    if (this.get('authenticated')) {
      return blockstack.loadUserData();
    }
  }),

  userId: computed('userData', function() {
    return this.get('userData.identityAddress');
  }),

  blockstackName: computed('userData', function() {
    return this.get('userData.username');
  })
});
