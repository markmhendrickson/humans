import Ember from 'ember';
import ListingMixin from 'humans/mixins/listing';

export default Ember.Component.extend(ListingMixin, {
  classNameBindings: [
    'format',
    'hasContent:hasContent:hasNoContent',
    'hasImage:hasImage:hasNoImage',
    'hasHeader:hasHeader:hasNoHeader'],
  tagName: 'li'
});
