import Route from '@ember/routing/route';
import blockstack from 'npm:blockstack';
import { inject as service } from '@ember/service';

export default Route.extend({
  nav: service(),

  model(params) {
    return new Promise((resolve, reject) => {
      blockstack.config.network.getNameInfo(params.blockstack_name).then((info) => {
        this.store.findRecord(params.blockstack_name, 'human', info.address).then(resolve).catch(reject);
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
