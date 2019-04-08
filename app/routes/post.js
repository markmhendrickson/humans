import config from 'humans/config/environment';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  router: service(),

  model(params) {
    return new Promise((resolve, reject) => {
      this.store.findRecord(this.get('session.blockstackName'), 'post', params.post_id).then(resolve).catch((error) => {
        resolve(this.store.createRecord('post', {
          id: params.post_id,
          author: this.get('session.human'),
          createdAt: new Date()
        }));
      });
    });
  },

  setupController(controller, post) {
    controller.set('model', post);
    this.set('headData.title', post.get('title'));
  },

  actions: {
    error(error) {
      if (error) {
        console.error(error);
        this.intermediateTransitionTo('not-found', error);
      }
    }
  }
});
