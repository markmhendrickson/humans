import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return new Promise((resolve, reject) => {
      let human = this.modelFor('human');

      this.store.findRecord(human.get('blockstackName'), 'post', params.id).then(resolve).catch(() => {
        if (this.get('session.blockstackName') === human.get('blockstackName')) {
          resolve(this.store.createRecord('post', {
            id: params.id,
            human: this.get('session.human'),
            createdAt: new Date()
          }));
        } else {
          reject();
        }
      });
    });
  },

  renderTemplate() {
    this.render('human/post', {
      into: 'application'
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
      }

      this.intermediateTransitionTo('not-found', { path: undefined });
    }
  }
});
