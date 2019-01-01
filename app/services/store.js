import DS from 'ember-data';
import PQueue from 'npm:p-queue';

export default DS.Store.extend({
  init: function() {
    this.set('queue', new PQueue({ concurrency: 1 }));
    return this._super(arguments);
  },

  queueSave: function(record) {
    this.get('queue').add(() => {
      this.set('saving', true);

      record.get('content').save().finally(() => {
        this.get('queue').onIdle().then(() => {
          this.set('savedAt', Date.now());
          this.set('saving', false);
        });
      });
    });
  },

  findRecord(blockstackName, modelName, id, options) {
    this.set('blockstackName', blockstackName);
    return this._super(modelName, id, options);
  }
});
