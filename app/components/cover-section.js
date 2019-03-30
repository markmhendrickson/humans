import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['human.coverImageUrl:has-image', 'human.overview:has-overview', 'hero', 'editable'],
  classNames: ['cover'],
  tagName: 'section',

  hero: computed('human.overview', 'store.editable', function() {
    return (!this.get('human.overview') && !this.get('editable'));
  })
});
