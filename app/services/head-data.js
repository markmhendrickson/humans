import HeadData from 'ember-cli-head/services/head-data';
import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

export default HeadData.extend({
  segment: service(),

  clear() {
    this.set('model', {});
  },

  setDefaultTitle() {
    this.set('title', 'Humans.');
  },

  trackPageView: observer('title', function() {
    if (!this.get('title')) { return; }

    next(() => {
      this.get('segment').trackPageView();
    });
  })
});
