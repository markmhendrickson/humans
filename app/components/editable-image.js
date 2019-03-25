import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  attributeBindings: ['title'],
  classNames: ['editable-image'],
  classNameBindings: ['editable', 'state', 'empty:empty:notEmpty'],
  deleteConfirmation: 'Are you sure you want to delete this image?',
  uploadLabel: 'Upload',

  didInsertElement() {
    if (this.get('url')) {
      this.set('state', 'loading');

      this.$('img').on('load', () => {
        this.set('state', 'loaded');
      });
    }

    let options = [{
      action: () => {
        this.$('input[type=file]').first().click();
      },
      icon: 'fas fa-upload',
      name: 'Upload'
    }, {
      action: () => {
        if(window.confirm(this.get('deleteConfirmation'))) {
          this.set('url', null);
        }
      },
      icon: 'fas fa-trash-alt',
      name: 'Delete'
    }];

    this.set('options', options);
  },

  empty: computed('hasFile', 'url', function() {
    return (!this.get('hasFile') && !this.get('url'));
  }),

  actions: {
    onchange: function(e) {
      let file,
        reader = new FileReader();

      if (e.srcElement.files) {
        file = e.srcElement.files[0];
      }

      this.set('hasFile', (file));

      if (file) {
        reader.onload = () => {
          this.set('url', reader.result);
          this.set('state', 'loaded');
        }

        reader.readAsDataURL(file);
      }
    }
  }
});
