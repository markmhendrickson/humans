import Component from '@ember/component';
import config from 'humans/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['customize-url-section'],
  domain: config.host.domain,
  ipAddress: config.host.ipAddress,
  tagName: 'section',
  session: service(),

  profileUrl: computed(function() {
    return `https://${this.get('domain')}/${this.get('session.blockstackName')}`;
  })
});
