import Route from '@ember/routing/route';
import blockstack from 'blockstack';
import config from 'humans/config/environment';

export default Route.extend({
  actions: {
    error(error) {
      if (error) {
        console.error(error);
      }

      this.intermediateTransitionTo('not-found', { path: undefined });
    },

    willTransition() {
      this.set('nav.hidden', false);
    }
  },

  setupController(model, controller) {
    controller.set('model', this.modelFor('human'));
  },

  afterModel(model) {
    this.set('headData.title', this.get('model.name'));
  }
});
