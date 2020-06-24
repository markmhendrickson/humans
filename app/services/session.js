import Service from '@ember/service';
import { computed } from '@ember/object';
import { AppConfig, UserSession } from 'blockstack';
import { inject as service } from '@ember/service';
import { showBlockstackConnect } from '@blockstack/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const authOptions = {
  redirectTo: '/',
  finished: ({ userSession }) => {
    location.reload();
  },
  userSession: userSession,
  appDetails: {
    name: 'Humans',
    icon: `${window.location.origin}/favicon.ico`,
  },
};

export default Service.extend({
  store: service(),

  authenticate(signIn) {
    showBlockstackConnect({...authOptions, ...{ sendToSignIn : signIn } });
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
