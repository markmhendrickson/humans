import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Component.extend({
  classNameBindings: ['shown'],
  classNames: ['store-indicator'],
  store: service(),

  didInsertElement: function() {
    this.tick();
  },

  tick: function() {
    var nextTick = run.later(this, () => {
      this.set('shown', (this.get('store.saving') || (this.get('store.savedAt') && this.get('store.savedAt') > Date.now() - 5000)));
      this.tick();
    }, 1000);

    this.set('nextTick', nextTick);
  },

  willDestroyElement: function() {
    Ember.run.cancel(this.get('nextTick'));
  }
});
