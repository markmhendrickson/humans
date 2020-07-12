import Service from '@ember/service';
import { computed } from '@ember/object';
import userSession from 'humans/services/user-session';
import { inject as service } from '@ember/service';
import { showBlockstackConnect } from '@blockstack/connect';

export default Service.extend({
  store: service(),

  authenticate(sendToSignIn) {
    let authOptions = {
      appDetails: {
        name: 'Humans',
        icon: `${window.location.origin}/favicon.ico`,
      },
      finished: ({ userSession }) => {
        window.location.reload();
      },
      redirectTo: '/',
      sendToSignIn: sendToSignIn ? true : false,
      userSession: userSession
    };

    showBlockstackConnect(authOptions);
  },

  authenticated: computed(() => {
    return userSession.isUserSignedIn();
  }),

  deauthenticate() {
    userSession.signUserOut((window && window.location) ? window.location.origin : null);
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
    return !userSession.isUserSignedIn();
  }),

  userData: computed('authenticated', function() {
    if (this.get('authenticated')) {
      return userSession.loadUserData();
    }
  }),

  userId: computed('userData', function() {
    return this.get('userData.identityAddress');
  }),

  blockstackName: computed('userData', function() {
    return this.get('userData.username');
  })
});
