import Component from '@ember/component';

export default Component.extend({
  classNameBindings: ['session.human:shown:hidden'],
  classNames: ['settings'],
  tagName: 'nav'
});
