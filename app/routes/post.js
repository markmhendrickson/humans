import config from 'humans/config/environment';
import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    let post = this.store.findRecord(this.get('session.blockstackName'), 'post', params.post_id, { include: 'image' });

    if (!post) {
      post = this.store.createRecord('post', {
        id: params.post_id
      });
    }

    return post;
  },

  setupController(controller, post) {
    this.set('headData.model', {
      articleAuthor: post.get('author.name'),
      articleModifiedTime: post.get('updatedAt'),
      articlePublishedTime: post.get('publishedAt'),
      canonicalUrl: `${config.location.protocol}://${config.location.host}/${this.router.generate('post', post.get('id'))}`,
      description: post.get('excerpt'),
      imageUrl: post.get('imageUrl'),
      title: post.get('title'),
      type: 'article'
    });
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
