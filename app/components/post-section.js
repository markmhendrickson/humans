import Component from '@ember/component';
import { observer } from '@ember/object';

export default Component.extend({
  classNameBindings: [
    'post.author.name:is-loaded:is-not-loaded',
    'post.body:hasBody:hasNoBody'
   ],
  classNames: ['post'],
  tagName: 'section',

  titleChanged: observer('post.title', function() {
    this.set('headData.title', this.get('post.title'));
  })
});
