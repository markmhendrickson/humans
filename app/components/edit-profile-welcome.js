import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['hidden'],
  classNames: ['edit-profile-welcome'],
  dismissed: false,

  hidden: computed('dismissed', 'cookies', function() {
    return (this.get('dismissed') || this.get('cookies').read('aeditProfileWelcomeHidden') === 'true');
  }),

  actions: {
    dismiss: function() {
      this.get('cookies').write('aeditProfileWelcomeHidden', true);
      this.set('dismissed', true);
    }
  }
});
