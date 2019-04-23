import Route from '@ember/routing/route';
import blockstack from 'blockstack';

export default Route.extend({
  beforeModel() {
    return new Promise((resolve, reject) => {
      if (blockstack.isSignInPending()) {
        blockstack.handlePendingSignIn().then(() => {
          window.location = window.location.pathname;
        }).catch(reject);
      } else if (this.get('session.authenticated')) {
        this.get('session').generateHuman().then((human) => {
          if (!human.get('blockstackName')) {
            human.set('blockstackName', this.get('session.blockstackName'));
            human.save().then(resolve).catch(reject);
          } else {
            resolve();
          }

        }).catch(reject);
      } else {
        resolve();
      }
    });
  }
});
