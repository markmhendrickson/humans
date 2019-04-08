import Ember from 'ember';
import ListingMixin from 'humans/mixins/listing';

export default Ember.Component.extend(ListingMixin, {
  classNameBindings: [
    'format',
    'hasContent:has-content:has-no-content',
    'hasImage:has-image:has-no-image',
    'hasHeader:has-header:has-no-header'],
  tagName: 'li'
});
