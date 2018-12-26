import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import Model from 'ember-data/model';
import { computed } from '@ember/object';
import blockstack from 'npm:blockstack';

export default Model.extend({
  description: attr('string'),
  name: attr('string'),

  blockstackName: computed('blockstackNames', function() {
    return this.get('blockstackNames.firstObject');
  }),

  blockstackNames: computed('id', function() {
    return new Promise((resolve, reject) => {
      blockstack.config.network.getNamesOwned(this.get('id')).then(resolve).catch(reject);
    });
  })
});
