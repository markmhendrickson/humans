import Route from '@ember/routing/route';

export default Route.extend({
  afterModel() {
    if (this.get('session.authenticated')) {
      this.transitionTo('human', this.get('session.blockstackName'));
    } else {
      this.get('headData').setDefaultTitle();
    }
  }
});

/*if (false && this.get('session.unauthenticated')) { // only for homepage signed out
  options = [{
    href: 'https://github.com/markmhx/humans',
    icon: 'fab fa-github',
    title: 'View on GitHub'
  }, {
    action: 'authenticate',
    icon: 'fas fa-sign-in-alt',
    title: 'Sign in'
  }];
}*/
