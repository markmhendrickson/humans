import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export function initialize() {
  Component.reopen({
    cookies: service(),
    headData: service(),
    nav: service(),
    session: service(),
    store: service(),

    editable: computed('store.editable', function() {
      return this.get('store.editable');
    })
  });
}

export default {
  initialize
};
