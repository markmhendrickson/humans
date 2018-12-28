import { computed } from '@ember/object';
import DS from 'ember-data';
import PQueue from 'npm:p-queue';

export default DS.Store.extend({
  init: function() {
    this.set('queue', new PQueue());
    return this._super.apply(this, arguments);
  },

  queueSave: function(record) {
    this.get('queue').add(() => {
      this.set('saving', true);

      record.save().finally(() => {
        this.get('queue').onIdle().then(() => {
          this.set('savedAt', Date.now());
          this.set('saving', false);
        });
      });
    });
  }
});
