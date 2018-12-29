import EmberRouter from '@ember/routing/router';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';

const Router = EmberRouter.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('human', { path: '/:blockstack_name' }); // :blockstack_name indicates Blockstack name that maps to Blockstack identity address that serves as human ID
  this.route('create-profile');
  this.route('customize-url');
});

export default Router;
