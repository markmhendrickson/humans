import DS from 'ember-data';
import blockstack from 'npm:blockstack';
import Inflector from 'ember-inflector';

export default DS.JSONAPIAdapter.extend({
  createRecord(store, type, snapshot) {
    let data = {};
    let serializer = store.serializerFor(type.modelName);

    serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

    return new Promise((resolve, reject) => {
      blockstack.putFile(`${Inflector.inflector.pluralize(type.modelName)}/${snapshot.id}`, JSON.stringify(data), {
        encrypt: false
      }).then(() => {
        resolve(data);
      }).catch(reject);
    });
  },

  findRecord(store, type, id) {
    return new Promise((resolve, reject) => {
      blockstack.getFile(`${Inflector.inflector.pluralize(type.modelName)}/${id}`, {
        decrypt: false,
        //username: store.blockstackName
      }).then((file) => {
        resolve(JSON.parse(file));
      }).catch((error) => {
        console.error(error);
        reject();
      });
    });
  },

  updateRecord(store, type, snapshot) {
    return this.createRecord(store, type, snapshot);
  }
});
