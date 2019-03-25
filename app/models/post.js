import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  author: DS.belongsTo('human'),
  body: DS.attr('string'),
  createdAt: DS.attr('date'),
  description: DS.attr('string'),
  excerpt: DS.attr('string'),
  //image: DS.belongsTo('image'),
  publishedAt: DS.attr('date'),
  subtitle: DS.attr('string'),
  title: DS.attr('string'),
  updatedAt: DS.attr('date'),

  hasContent: computed('body', 'title', function() {
    return (this.get('body') && this.get('title'));
  }),

  hasHeaderImage: computed('image.{type,url}', function() {
    return (this.get('image.url') && this.get('image.type') !== 'logo');
  })
});
