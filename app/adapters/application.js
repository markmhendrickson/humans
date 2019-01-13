import DS from 'ember-data';
import blockstack from 'npm:blockstack';
import Inflector from 'ember-inflector';
import config from 'humans/config/environment';
import dataUriToBuffer from 'npm:data-uri-to-buffer';
import async from 'npm:async';
import mime from 'npm:mime-types';

let appOrigin = `${config.location.protocol}://${config.location.hostname}`;

export default DS.JSONAPIAdapter.extend({
  createRecord(store, type, snapshot) {
    let doc = {};
    let serializer = store.serializerFor(type.modelName);

    serializer.serializeIntoHash(doc, type, snapshot, { includeId: true });

    return new Promise((resolve, reject) => {
      let saveAsset = (property, done) => {
        if (property.toLowerCase().indexOf('url') !== -1 && doc.data.attributes[property] && doc.data.attributes[property].indexOf('data:') === 0) {
          let pluralType = Inflector.inflector.pluralize(type.modelName),
            mediaType = doc.data.attributes[property].substring(5, doc.data.attributes[property].indexOf(';')),
            path = `assets/${pluralType}-${snapshot.id}-${property}.${mime.extension(mediaType)}`;

          blockstack.putFile(path, dataUriToBuffer(doc.data.attributes[property]), {
            encrypt: false
          }).then((url) => {
            if (url) {
              doc.data.attributes[property] = url;
            }

            done();
          }).catch(done);
        } else {
          done();
        }
      }

      let saveAssets = function(done) {
        async.each(Object.keys(doc.data.attributes), saveAsset, done);
      }

      let saveRecord = function(done) {
        blockstack.putFile(`${Inflector.inflector.pluralize(type.modelName)}/${snapshot.id}`, JSON.stringify(doc), {
          encrypt: false
        }).then(() => {
          done();
        }).catch(done);
      }

      async.series([saveAssets, saveRecord], (error) => {
        if (error) {
          console.error('Failed to create record', error);
          reject(error);
        } else {
          resolve(doc);
        }
      });
    });
  },

  findRecord(store, type, id) {
    return new Promise((resolve, reject) => {
      let options = {
        decrypt: false,
        username: store.blockstackName
      };

      if (config.location.hostname !== window.location.hostname) {
        options.app = appOrigin;
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
