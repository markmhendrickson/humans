import Component from '@ember/component';
import { computed } from '@ember/object';
import striptags from 'npm:striptags';

export default Component.extend({
  classNameBindings: ['editable', 'human.overview:notEmpty:empty'],
  classNames: ['overview'],
  tagName: 'section'
});
