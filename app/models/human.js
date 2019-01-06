import attr from 'ember-data/attr';
import DS from 'ember-data';
import Model from 'ember-data/model';
import { computed } from '@ember/object';
import blockstack from 'npm:blockstack';

export default Model.extend({
  coverImageUrl: attr('string'),
  description: attr('string'),
  name: attr('string'),

  blockstackName: computed('blockstackNames.length', function() {
    return this.get('blockstackNames.firstObject');
  }),

  blockstackNames: computed('id', function() {
    return DS.PromiseArray.create({
      promise: new Promise((resolve, reject) => {
        blockstack.config.network.getNamesOwned(this.get('id')).then(resolve).catch(reject);
      })
    });
  })
});
