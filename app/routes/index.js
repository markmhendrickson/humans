import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (this.get('session.authenticated')) {
      if (this.get('session.blockstackName')) {
        return this.transitionTo('human.index', this.get('session.blockstackName'));
      } else {
        return this.transitionTo('register-blockstack-name');
      }
    }

    this.get('headData').setDefaultTitle();
  }
});
