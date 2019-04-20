import { computed } from '@ember/object';
import blockstack from 'blockstack';
import DS from 'ember-data';

export default DS.Model.extend({
  coverImageUrl: DS.attr('string'),
  description: DS.attr('string'),
  imageUrl: DS.attr('string'),
  name: DS.attr('string'),
  posts: DS.hasMany('post'),
  overview: DS.attr('string'),
  updatedAt: DS.attr('date'),

  blockstackName: computed('blockstackNames.firstObject', function() {
    return this.get('blockstackNames.firstObject');
  }),

  blockstackNames: computed('id', function() {
    return DS.PromiseArray.create({
      promise: new Promise((resolve, reject) => {
        blockstack.config.network.getNamesOwned(this.get('id')).then(resolve).catch(reject);
      })
    });
  }),

  hasContent: computed('coverImageUrl', 'description', 'imageUrl', 'name', function() {
    return (this.get('coverImageUrl') || this.get('description') || this.get('imageUrl') || this.get('name'));
  })
});
