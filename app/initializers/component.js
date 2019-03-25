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

    editable: computed('nav.editable', function() {
      return this.get('nav.editable');
    })
  });
}

export default {
  initialize
};
