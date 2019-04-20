import Component from '@ember/component';

export default Component.extend({
  attributeBindings: ['model.name:data-name'],
  classNameBindings: [
    'model.name:has-name:has-no-name',
    'model.imageUrl:notEmpty:empty',
    'model.isLoaded:is-loaded:is-not-loaded'
  ],
  classNames: ['human-image'],
  tagName: 'nav'
});
