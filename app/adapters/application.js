import DS from 'ember-data';
import blockstack from 'npm:blockstack';
import Ember from 'ember';

export default DS.JSONAPIAdapter.extend({
  createRecord(store, type, snapshot) {
    let path = `${Ember.Inflector.inflector.pluralize(type.modelName)}/${snapshot.id}`;
    let data = {};
    let serializer = store.serializerFor(type.modelName);
    let url = this.buildURL(type.modelName, null, snapshot, 'createRecord');

    serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

    return new Promise((resolve, reject) => {
      blockstack.putFile(path, JSON.stringify(data), {
        encrypt: false
      }).then(() => {
        resolve(data);
      }).catch(reject);
    });
  },

  findRecord(store, type, id, snapshot) {
    return new Promise((resolve, reject) => {
      let path = `${Ember.Inflector.inflector.pluralize(type.modelName)}/${id}`;

      blockstack.getFile(path, {
        decrypt: false
      }).then((file) => {
        resolve(JSON.parse(file));
      }).catch(reject);
    });
  },

  updateRecord(store, type, snapshot) {
    this.createRecord(store, type, snapshot);
  }
});
