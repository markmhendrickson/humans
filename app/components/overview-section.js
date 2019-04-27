import Component from '@ember/component';

export default Component.extend({
  classNameBindings: ['editable', 'human.overview:notEmpty:empty'],
  classNames: ['overview'],
  tagName: 'section'
});
