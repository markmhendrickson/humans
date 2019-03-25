import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['nav.hidden:hidden', 'nav.editable:editMode:viewMode'],
  classNames: ['app'],
  tagName: 'nav',
  options: [{
    action: 'setEditMode',
    icon: 'fas fa-pencil-alt',
    title: 'Edit mode'
  }, {
    action: 'setViewMode',
    icon: 'far fa-eye',
    title: 'View mode'
  }, {
    route: 'customize-url',
    icon: 'fas fa-cog',
    title: 'Customize URL'
  }],

  actions: {
    authenticate() {
      this.get('session').authenticate();
    },

    deauthenticate() {
      this.get('session').deauthenticate();
    },

    toggleMode(editable) {
      this.set('nav.editable', editable);
    }
  }
});
