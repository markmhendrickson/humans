import DS from 'ember-data';
import PQueue from 'p-queue';
import { inject as service } from '@ember/service';

export default DS.Store.extend({
  session: service(),

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
    this.set('editable', this.get('session.authenticated'));

    return this._super(arguments);
  },

  queueSave: function(record) {
    this.get('queue').add(() => {
      record.save();
    });
  },

  findRecord(blockstackName, modelName, id, options) {
    this.set('blockstackName', blockstackName);

    return new Promise((resolve, reject) => {
      this._super(modelName, id, options).then((record) => {
        if (modelName === 'human') {
          record.get('blockstackNames').then(() => {
            resolve(record);
          });
        } else {
          resolve(record);
        }
      }).catch(reject);
    });
  },

  query(blockstackName, type, query) {
    return new Promise((resolve, reject) => {
      this.findAll(type, { reload: true }).then((records) => {
        if (query['filter']) {
          Object.keys(query['filter']).forEach((key) => {
            records = records.filterBy(key, query['filter'][key]);
          });
        }

        if (query['sort']) {
          if (query['sort'].indexOf('-') === 0) {
            records = records.sortBy(query['sort'].substring(1)).reverse();
          } else {
            records = records.sortBy(query['sort']);
          }
        }

        if (query['limit']) {
          records = records.slice(0, query['limit']);
        }

        resolve(records);
      }).catch(reject);
    });
  }
});
