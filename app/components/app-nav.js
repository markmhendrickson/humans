import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['nav.hidden:hidden'],
  classNames: ['app'],
  tagName: 'nav',

  options: computed('headData.title', 'session.authenticated', 'session.blockstackName', function() {
    let options;

    if (this.get('session.unauthenticated')) {
      options = [{
        href: 'https://github.com/markmhx/humans',
        icon: 'fab fa-github',
        title: 'View on GitHub'
      }, {
        action: 'authenticate',
        icon: 'fas fa-sign-in-alt',
        title: 'Sign in'
      }];
    } else {
      options = [{
        route: 'index',
        icon: 'fas fa-pencil-alt',
        title: 'Edit profile'
      }];

      if (this.get('session.blockstackName')) {
        options.push({
          param: this.get('session.blockstackName'),
          route: 'human',
          icon: 'far fa-eye',
          title: 'View public profile'
        });
      }

      options.push({
        route: 'customize-url',
        icon: 'fas fa-cog',
        title: 'Customize URL'
      }, {
        action: 'deauthenticate',
        icon: 'fas fa-sign-out-alt',
        title: 'Sign out'
      });
    }

    return options;
  }),

  actions: {
    authenticate() {
      this.get('session').authenticate();
    },

    deauthenticate() {
      this.get('session').deauthenticate();
    }
  }
});
