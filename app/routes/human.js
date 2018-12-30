import Route from '@ember/routing/route';
import blockstack from 'npm:blockstack';
import config from 'humans/config/environment';
import { inject as service } from '@ember/service';

export default Route.extend({
  nav: service(),

  model(params) {
    let blockstackName = params.blockstack_name ? params.blockstack_name : config.blockstackName;

    return new Promise((resolve, reject) => {
      blockstack.config.network.getNameInfo(blockstackName).then((info) => {
        this.store.findRecord(blockstackName, 'human', info.address).then(resolve).catch(reject);
      });
    });
  },

  afterModel() {
    this.set('nav.hidden', true);
  },

  actions: {
    willTransition() {
      this.set('nav.hidden', false);
    }
  }
});
