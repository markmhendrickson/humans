import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (this.get('session.blockstackName')) {
      return this.transitionTo('index');
    }

    this.set('headData.title', 'Register Blockstack username');
  }
});
