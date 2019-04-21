import DS from 'ember-data';
import blockstack from 'blockstack';
import Inflector from 'ember-inflector';
import config from 'humans/config/environment';
import dataUriToBuffer from 'data-uri-to-buffer';
import async from 'async';
import mime from 'mime-types';

let appOrigin = `${config.location.protocol}://${config.location.hostname}`;

let getFile = function(store, path, done) {
  let options = {
    decrypt: false,
    username: store.blockstackName
  };

  if (config.location.hostname !== window.location.hostname) {
    options.app = appOrigin;
  }

  blockstack.getFile(path, options).then((file) => {
    done(null, JSON.parse(file));
  }).catch((error) => {
    console.error(`No record found at path ${path}`, error);
    done(error);
  });
};

export default DS.JSONAPIAdapter.extend({
  createRecord(store, type, snapshot) {
    let adapter = this,
      doc = {},
      serializer = store.serializerFor(type.modelName);

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

      let saveIndex = function(done) {
        adapter.findAll(store, type, true).then((records) => {
          blockstack.putFile(`indices/${Inflector.inflector.pluralize(type.modelName)}`, JSON.stringify(records.data.map((r) => `${Inflector.inflector.pluralize(type.modelName)}/${r.id}`)), {
            encrypt: false
          }).then(() => {
            done();
          }).catch(done);
        }).catch(done);
      }

      async.series([saveAssets, saveRecord, saveIndex], (error) => {
        if (error) {
          console.error('Failed to create record', error);
          reject(error);
        } else {
          resolve(doc);
        }
      });
    });
  },

  deleteRecord(store, type, snapshot) {
    return new Promise((resolve, reject) => {
      blockstack.putFile(`${Inflector.inflector.pluralize(type.modelName)}/${snapshot.id}`, '{}', {
        encrypt: false
      }).then(() => {
        resolve();
      }).catch(reject);
    });
  },

  findAll(store, type, uselistFiles) {
    return new Promise((resolve, reject) => {
      let getPaths = function(done) {
        let paths = [],
          promise;

        if (uselistFiles) {
          promise = blockstack.listFiles((path) => {
            if (path.indexOf(Inflector.inflector.pluralize(type.modelName)) === 0) {
              paths.push(path);
            }

            return true;
          });

          promise.then(() => {
            done(null, paths);
          });
        } else {
          getFile(store, `indices/${Inflector.inflector.pluralize(type.modelName)}`, (error, file) => {
            done(null, file);
          });
        }
      };

      let getFiles = function(paths, done) {
        async.map(paths, (path, done) => {
          getFile(store, path, done);
        }, done);
      };

      async.waterfall([getPaths, getFiles], (error, files) => {
        if (error) {
          console.error(`Failed to findAll for type ${type.modelName}`, error);
          reject(error);
        } else {
          let doc = {
            data: []
          };

          files.forEach((file) => {
            if (file.data) {
              doc.data.push(file.data);
            }
          });

          resolve(doc);
        }
      });
    });
  },

  findRecord(store, type, id) {
    return new Promise((resolve, reject) => {
      getFile(store, `${Inflector.inflector.pluralize(type.modelName)}/${id}`, (error, file) => {
        if (file) {
          resolve(file);
        } else {
          reject();
        }
      });
    });
  },

  updateRecord(store, type, snapshot) {
    return this.createRecord(store, type, snapshot);
  }
});
