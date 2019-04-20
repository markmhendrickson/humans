import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (this.get('session.authenticated')) {
      return this.transitionTo('human', this.get('session.blockstackName'));
    }

    this.get('headData').setDefaultTitle();
  }
});
