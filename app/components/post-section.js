import Component from '@ember/component';
import { observer } from '@ember/object';
import config from 'humans/config/environment';

export default Component.extend({
  blockstackName: config.blockstackName,
  classNameBindings: [
    'post.body:hasBody:hasNoBody'
   ],
  classNames: ['post'],
  tagName: 'section',

  titleChanged: observer('post.title', function() {
    this.set('headData.title', this.get('post.title'));

    if (this.get('post.title').trim()) {
      this.set('headData.title', this.get('post.title'));
    } else if (this.get('post.human.name')) {
      this.set('headData.title', this.get('post.human.name'));
    } else {
      this.get('headData').setDefaultTitle();
    }
  })
});
