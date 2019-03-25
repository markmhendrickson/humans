import Component from '@ember/component';

export default Component.extend({
  classNameBindings: ['post.body:hasBody:hasNoBody'],
  classNames: ['post'],
  tagName: 'section'
});
