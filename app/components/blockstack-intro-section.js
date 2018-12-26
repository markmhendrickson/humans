import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['blockstack-intro'],
  session: service(),
  tagName: 'section',

  actions: {
    authenticate() {
      this.get('session').authenticate();
    }
  }
});
