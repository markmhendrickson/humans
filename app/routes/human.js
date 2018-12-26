import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import blockstack from 'npm:blockstack';

export default Route.extend({
  session: service(),

  model(params) {
    return new Promise((resolve, reject) => {
      this.store.blockstackName = params.blockstack_name;
      blockstack.config.network.getNameInfo(params.blockstack_name).then((info) => {
        this.store.findRecord('human', info.address).then(resolve).catch(reject);
      });
    });
  }
});
