import Component from '@ember/component';

export default Component.extend({
  classNames: ['editable-image'],
  classNameBindings: ['editable', 'state', 'url:notEmpty:empty'],

  didInsertElement() {
    if (this.get('url')) {
      this.set('state', 'loading');

      this.$('img').on('load', () => {
        this.set('state', 'loaded');
      });
    }
  }
});
