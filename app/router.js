import EmberRouter from '@ember/routing/router';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';

const Router = EmberRouter.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  if (config.blockstackName) {
    this.route('human', { path: '/' }, function() {
      this.route('post', { path: '/posts/:id' });
    });
  } else {
    this.route('human', { path: ':blockstack_name' }, function() {
      this.route('index', { path: '/' });
      this.route('post', { path: '/posts/:id' });
    });

    this.route('settings');
    this.route('register-blockstack-name');
  }

  this.route('not-found', { path: '*path' });
});

export default Router;
