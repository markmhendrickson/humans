import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['nav.hidden:hidden'],
  classNames: ['app'],
  nav: service(),
  session: service(),
  store: service(),
  tagName: 'nav',

  showSave: computed('session.human.hasDirtyAttributes', function() {
    return (this.get('session.human.hasDirtyAttributes') && !this.get('store.isSaving'));
  }),

  actions: {
    authenticate() {
      this.get('session').authenticate();
    },

    deauthenticate() {
      this.get('session').deauthenticate();
    },

    saveChanges() {
      this.get('session.human').save();
    }
  }
});
