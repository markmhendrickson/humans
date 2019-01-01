import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNameBindings: ['hasContent:hasContent'],
  classNames: ['store-indicator'],
  store: service(),

  hasContent: computed('store.{saving,savedAt}', function() {
    return (this.get('store.saving') || this.get('store.savedAt'));
  })
});
