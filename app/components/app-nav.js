import Component from '@ember/component';

export default Component.extend({
  classNames: ['app'],
  tagName: 'nav',

  actions: {
    authenticate() {
      this.get('session').authenticate();
    }
  }
});
