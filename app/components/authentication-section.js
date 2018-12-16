import Component from '@ember/component';
import blockstack from 'npm:blockstack';

export default Component.extend({
  classNames: ['viewport'],
  tagName: 'section',

  actions: {
    authenticate() {
      blockstack.redirectToSignIn();
    }
  }
});
