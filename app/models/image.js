import DS from 'ember-data';
import orientation from 'personal-web/utils/orientation';

export default DS.Model.extend({
  description: DS.attr('string'),
  height: DS.attr('number'),
  orientation: orientation,
  posts: DS.hasMany('post'),
  type: DS.attr('string'),
  url: DS.attr('string'),
  width: DS.attr('number')
});
