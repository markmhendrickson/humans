import Component from '@ember/component';

export default Component.extend({
  classNames: ['sign-out'],
  tagName: 'section',

  actions: {
    deauthenticate() {
      this.get('session').deauthenticate();
    }
  }
});
