import Route from '@ember/routing/route';
import blockstack from 'npm:blockstack';

export default Route.extend({
  beforeModel() {
    return new Promise((resolve, reject) => {
      if (blockstack.isSignInPending()) {
        blockstack.handlePendingSignIn().then(() => {
          window.location = window.location.pathname;
        }).catch(reject);
      } else {
        resolve();
      }
    });
  },

  model() {
    return this.get('session.human');
  }
});
