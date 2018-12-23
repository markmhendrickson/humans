import Component from '@ember/component';
import blockstack from 'npm:blockstack';

export default Component.extend({
  classNames: ['authentication'],
  tagName: 'section',

  actions: {
    authenticate() {
      blockstack.redirectToSignIn();
    }
  }
});
