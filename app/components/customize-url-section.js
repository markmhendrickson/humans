import Component from '@ember/component';
import ENV from 'humans/config/environment';

export default Component.extend({
  classNames: ['customize-url-section'],
  domain: ENV.host.domain,
  ipAddress: ENV.host.ipAddress,
  tagName: 'section'
});
