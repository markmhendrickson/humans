import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import Model from 'ember-data/model';

export default Model.extend({
  description: attr('string'),
  name: attr('string')
});
