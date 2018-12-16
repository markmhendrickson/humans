import Route from '@ember/routing/route';
import blockstack from 'npm:blockstack';

export default Route.extend({
  model() {
    return new Promise((resolve, reject) => {
      if (blockstack.isSignInPending()) {
        blockstack.handlePendingSignIn().then(resolve).catch(reject);
      } else {
        resolve();
      }
    });
  }
});
