import Component from '@ember/component';

export default Component.extend({
  attributeBindings: ['model.name:data-name'],
  classNameBindings: [
    'model.name:has-name:has-no-name',
    'model.isLoaded:is-loaded:is-not-loaded',
    'model.imageUrl:notEmpty:empty'
  ],
  classNames: ['human-image'],
  tagName: 'nav'
});
