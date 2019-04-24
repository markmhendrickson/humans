import Route from '@ember/routing/route';
import blockstack from 'blockstack';
import config from 'humans/config/environment';

export default Route.extend({
  actions: {
    error(error) {
      if (error) {
        console.error(error);
      }

      this.intermediateTransitionTo('not-found', { path: undefined });
    }
  },

  model(params) {
    return new Promise((resolve, reject) => {
      let blockstackName = params.blockstack_name ? params.blockstack_name : config.blockstackName;

      if (!blockstackName) {
        return reject();
      }

      blockstack.config.network.getNameInfo(blockstackName).then((info) => {
        this.store.findRecord(blockstackName, 'human', info.address).then(resolve).catch(reject);
      }).catch(reject);
    });
  }
});
