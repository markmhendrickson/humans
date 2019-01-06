import DS from 'ember-data';
import blockstack from 'npm:blockstack';
import Inflector from 'ember-inflector';
import config from 'humans/config/environment';

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
      let options = {
        decrypt: false,
        username: store.blockstackName
      };

      if (config.location.hostname !== window.location.hostname) {
        options.app = `${config.location.protocol}://${config.location.hostname}`;
      }

      blockstack.getFile(`${Inflector.inflector.pluralize(type.modelName)}/${id}`, options).then((file) => {
        resolve(JSON.parse(file));
      }).catch((error) => {
        console.error(`No record found for type ${type.modelName} and id ${id}`, error);
        reject();
      });
    });
  },

  updateRecord(store, type, snapshot) {
    return this.createRecord(store, type, snapshot);
  }
});
