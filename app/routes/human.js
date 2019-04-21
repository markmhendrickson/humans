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
    },

    willTransition() {
      this.set('nav.hidden', false);
    }
  },

  afterModel(model) {
    this.set('headData.title', model.get('name'));

    if (this.get('session.human.id') !== model.get('id')) {
      this.set('nav.hidden', true);
    }
  },

  model(params) {
    let blockstackName = params.blockstack_name ? params.blockstack_name : config.blockstackName;

    return new Promise((resolve, reject) => {
      blockstack.config.network.getNameInfo(blockstackName).then((info) => {
        this.store.findRecord(blockstackName, 'human', info.address).then(resolve).catch(reject);
      });
    });
  }
});
