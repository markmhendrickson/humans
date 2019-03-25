import DS from 'ember-data';
import PQueue from 'npm:p-queue';

export default DS.Store.extend({
  createRecord(modelName, inputProperties) {
    // fix for https://github.com/locks/ember-localstorage-adapter/issues/219
    let record = this.getReference(modelName, inputProperties.id);

    if (record) {
      this.unloadRecord(record.internalModel);
    }

    return this._super(modelName, inputProperties);
  },

  init: function() {
    this.set('queue', new PQueue({ concurrency: 1 }));
    return this._super(arguments);
  },

  queueSave: function(record) {
    this.get('queue').add(() => {
      record.save();
    });
  },

  findRecord(blockstackName, modelName, id, options) {
    this.set('blockstackName', blockstackName);
    return this._super(modelName, id, options);
  }
});
