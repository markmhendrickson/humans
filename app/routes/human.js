import Route from '@ember/routing/route';
import blockstack from 'npm:blockstack';

export default Route.extend({
  model(params) {
    return new Promise((resolve, reject) => {
      blockstack.config.network.getNameInfo(params.blockstack_name).then((info) => {
        //this.store.blockstackName = params.blockstack_name;
        this.store.findRecord('human', info.address).then(resolve).catch(reject);
      });
    });
  }
});
