import { computed } from '@ember/object';
import blockstack from 'blockstack';
import DS from 'ember-data';

export default DS.Model.extend({
  blockstackName: DS.attr('string'),
  coverImageUrl: DS.attr('string'),
  description: DS.attr('string'),
  imageUrl: DS.attr('string'),
  name: DS.attr('string'),
  posts: DS.hasMany('post'),
  overview: DS.attr('string'),
  updatedAt: DS.attr('date'),

  hasContent: computed('coverImageUrl', 'description', 'imageUrl', 'name', function() {
    return (this.get('coverImageUrl') || this.get('description') || this.get('imageUrl') || this.get('name'));
  })
});
