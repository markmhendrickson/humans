import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  model() {
    return new Promise((resolve, reject) => {
      let id = this.get('session').userData.identityAddress;

      this.get('store').findRecord('human', id).then((human) => {
        resolve({
          human: human
        });
      }).catch((error) => {
        // Fix for https://github.com/locks/ember-localstorage-adapter/issues/219
        this.get('store').unloadRecord(this.get('store').getReference('human', id).internalModel);

        resolve({
          human: this.get('store').createRecord('human', { id: id })
        });
      });
    });
  }
});
