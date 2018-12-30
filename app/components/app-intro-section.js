import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['showImages'],
  classNames: ['app-intro', 'hero'],
  tagName: 'section',
  imagesLoaded: 0,

  didInsertElement() {
    this.$('img').on('load', () => {
      this.incrementProperty('imagesLoaded');
    });
  },

  showImages: computed('imagesLoaded', function() {
    return (this.get('imagesLoaded') == 2);
  })
});
