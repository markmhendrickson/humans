import Component from '@ember/component';
import { computed } from '@ember/object';
import config from 'humans/config/environment';

export default Component.extend({
  classNameBindings: ['hidden'],
  classNames: ['edit-profile-welcome'],
  dismissed: false,
  location: config.location,

  hidden: computed('dismissed', 'cookies', function() {
    return (!this.get('session.authenticated') || this.get('dismissed') || this.get('cookies').read('aeditProfileWelcomeHidden') === 'true');
  }),

  actions: {
    dismiss: function() {
      this.get('cookies').write('aeditProfileWelcomeHidden', true);
      this.set('dismissed', true);
    }
  },

  host: computed('location.{hostname,port,protocol}', function() {
    return this.get('location.port') !== 80 ? `${this.get('location.hostname')}:${this.get('location.port')}` : this.get('location.hostname');
  }),

  profileUrl: computed('location.{host,protocol}', 'session.blockstackName', function() {
    return `${this.get('location.protocol')}://${this.get('host')}/${this.get('session.blockstackName')}`;
  })
});
