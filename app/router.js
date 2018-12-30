import EmberRouter from '@ember/routing/router';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';

const Router = EmberRouter.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  if (config.blockstackName) {
    this.route('human', { path: '/' });
  } else {
    this.route('human', { path: '/:blockstack_name' });
    this.route('create-profile');
    this.route('customize-url');
  }
});

export default Router;
