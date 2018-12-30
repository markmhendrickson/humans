import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['showImages'],
  classNames: ['blockstack-intro', 'hero'],
  session: service(),
  tagName: 'section',
  imagesLoaded: 0,

  didInsertElement() {
    this.$('img').on('load', () => {
      this.incrementProperty('imagesLoaded');
    });
  },

  showImages: computed('imagesLoaded', function() {
    return (this.get('imagesLoaded') == 2);
  }),

  actions: {
    authenticate() {
      this.get('session').authenticate();
    }
  }
});
