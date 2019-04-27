import Component from '@ember/component';
import ListingMixin from 'humans/mixins/listing';
import { computed } from '@ember/object';
import config from 'humans/config/environment';

export default Component.extend(ListingMixin, {
  blockstackName: config.blockstackName,
  classNameBindings: [
    'format',
    'hasContent:has-content:has-no-content',
    'hasImage:has-image:has-no-image',
    'hasHeader:has-header:has-no-header'],
  tagName: 'li',

  routeName: computed('', function() {
    return `human.${this.get('modelName')}`;
  })
});
