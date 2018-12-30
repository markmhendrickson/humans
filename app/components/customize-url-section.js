import Component from '@ember/component';
import config from 'humans/config/environment';

export default Component.extend({
  classNames: ['customize-url-section'],
  domain: config.host.domain,
  ipAddress: config.host.ipAddress,
  tagName: 'section'
});
