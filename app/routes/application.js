import Route from '@ember/routing/route';
import blockstack from 'npm:blockstack';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel() {
    return new Promise((resolve, reject) => {
      if (blockstack.isSignInPending()) {
        blockstack.handlePendingSignIn().then(resolve).catch(reject);
      } else {
        resolve();
      }
    });
  },

  model() {
    return this.get('session.human');
  }
});
