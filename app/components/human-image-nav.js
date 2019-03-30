import Component from '@ember/component';

export default Component.extend({
  classNameBindings: ['model.imageUrl:notEmpty:empty'],
  classNames: ['human-image'],
  tagName: 'nav'
});
