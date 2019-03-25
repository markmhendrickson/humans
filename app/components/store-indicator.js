import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { run } from '@ember/runloop';

export default Component.extend({
  classNameBindings: ['shown'],
  classNames: ['store-indicator'],
  timeout: 5000,

  actions: {
    saveChanges() {
      if (this.get('model.isNew')) {
        this.set('model.createdAt', new Date());
        this.set('model.publishedAt', new Date());
      }

      this.set('model.updatedAt', new Date());
      this.get('store').queueSave(this.get('model'));
    }
  },

  hasChanges: computed('model.{hasDirtyAttributes,hasContent,isNew}', function() {
    return this.get('model.hasDirtyAttributes') && (this.get('model.hasContent') || !this.get('model.isNew'));
  }),

  savingChanged: observer('model.isSaving', function() {
    if (this.get('model.isSaving')) {
      this.set('hasSaved', true);
      return;
    }

    this.set('savedRecently', true);

    run.later(() => {
      this.set('savedRecently', false);

      run.later(() => {
        this.set('hasSaved', false);
      }, 250);
    }, this.get('timeout'));
  }),

  shown: computed('savedRecently', 'model.hasDirtyAttributes', 'model.isSaving', function() {
    return (this.get('model.hasDirtyAttributes') || this.get('model.isSaving') || this.get('savedRecently'));
  })
});
