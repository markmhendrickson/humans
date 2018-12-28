import attr from 'ember-data/attr';
import DS from 'ember-data';
import { hasMany } from 'ember-data/relationships';
import Model from 'ember-data/model';
import { computed } from '@ember/object';
import blockstack from 'npm:blockstack';

export default Model.extend({
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
  }),

  profileUrl: computed('blockstackName', function() {
    return `${window.location.origin}/${this.get('blockstackName')}`;
  })
});
