import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNameBindings: ['nav.hidden:hidden'],
  classNames: ['app'],
  nav: service(),
  session: service(),
  tagName: 'nav',

  actions: {
    authenticate() {
      this.get('session').authenticate();
    },

    deauthenticate() {
      this.get('session').deauthenticate();
    }
  }
});
