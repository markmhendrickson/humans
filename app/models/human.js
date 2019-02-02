import { PromiseArray } from 'ember-data';
import { computed } from '@ember/object';
import blockstack from 'npm:blockstack';
import DS from 'ember-data';

export default DS.Model.extend({
  coverImageUrl: DS.attr('string'),
  description: DS.attr('string'),
  name: DS.attr('string'),
  overview: DS.attr('string'),
  updatedAt: DS.attr('date'),

  blockstackName: computed('blockstackNames.length', function() {
    return this.get('blockstackNames.firstObject');
  }),

  blockstackNames: computed('id', function() {
    return PromiseArray.create({
      promise: new Promise((resolve, reject) => {
        blockstack.config.network.getNamesOwned(this.get('id')).then(resolve).catch(reject);
      })
    });
  }),

  hasContent: computed('coverImageUrl', 'description', 'name', function() {
    return (this.get('coverImageUrl') || this.get('description') || this.get('name'));
  })
});
