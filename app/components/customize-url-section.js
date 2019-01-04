import Component from '@ember/component';
import config from 'humans/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['customize-url'],
  location: config.location,
  tagName: 'section',
  session: service(),

  host: computed('location.{hostname,port,protocol}', function() {
    return this.get('location.port') ? `${this.get('location.hostname')}:${this.get('location.port')}` : this.get('location.hostname');
  }),

  profileUrl: computed('location.{host,protocol}', 'session.blockstackName', function() {
    return `${this.get('location.protocol')}://${this.get('host')}/${this.get('session.blockstackName')}`;
  })
});
