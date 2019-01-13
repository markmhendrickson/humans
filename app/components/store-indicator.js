import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Component.extend({
  classNameBindings: ['shown'],
  classNames: ['store-indicator'],
  session: service(),
  store: service(),
  timeout: 5000,

  actions: {
    saveChanges() {
      this.set('session.human.updatedAt', new Date());
      this.get('store').queueSave(this.get('session.human'));
    }
  },

  savingChanged: observer('session.human.isSaving', function() {
    if (this.get('session.human.isSaving')) {
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

  shown: computed('savedRecently', 'session.human.hasDirtyAttributes', 'session.human.isSaving', function() {
    return (this.get('session.human.hasDirtyAttributes') || this.get('session.human.isSaving') || this.get('savedRecently'));
  })
});
