import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'humans/config/environment';

export default Component.extend({
  attributeBindings: ['model.name:data-name'],
  blockstackName: config.blockstackName,
  classNameBindings: [
    'model.name:has-name:has-no-name',
    'model.imageUrl:notEmpty:empty',
    'model.isLoaded:is-loaded:is-not-loaded'
  ],
  classNames: ['human-image'],
  tagName: 'nav'
});
