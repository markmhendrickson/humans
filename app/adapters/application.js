import DS from 'ember-data';
import userSession from 'humans/services/user-session';
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

  userSession.getFile(path, options).then((file) => {
    done(null, JSON.parse(file));
  }).catch((error) => {
    console.error(`No record found at path ${path}`, error);
    done(error);
  });
};

export default DS.JSONAPIAdapter.extend({
  createRecord(store, type, snapshot) {
    let doc = {},
      serializer = store.serializerFor(type.modelName);

    serializer.serializeIntoHash(doc, type, snapshot, { includeId: true });

    return new Promise((resolve, reject) => {
      let saveAsset = (property, done) => {
        if (property.toLowerCase().indexOf('url') !== -1 && doc.data.attributes[property] && doc.data.attributes[property].indexOf('data:') === 0) {
          let pluralType = Inflector.inflector.pluralize(type.modelName),
            mediaType = doc.data.attributes[property].substring(5, doc.data.attributes[property].indexOf(';')),
            path = `assets/${pluralType}-${snapshot.id}-${property}.${mime.extension(mediaType)}`;

          userSession.putFile(path, dataUriToBuffer(doc.data.attributes[property]), {
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
        userSession.putFile(`${Inflector.inflector.pluralize(type.modelName)}/${snapshot.id}`, JSON.stringify(doc), {
          encrypt: false
        }).then(() => {
          done();
        }).catch(done);
      }

      let getIndex = function(done) {
        getFile(store, `indices/${Inflector.inflector.pluralize(type.modelName)}`, (error, index) => {
          if (error || !index || !index.data) {
            index = { data: [] };
          }

          done(null, index);
        });
      }

      let updateIndex = function(index, done) {
        index.data.push(doc);

        userSession.putFile(`indices/${Inflector.inflector.pluralize(type.modelName)}`, JSON.stringify(index), {
          encrypt: false
        }).then(() => {
          done();
        }).catch(done);
      }

      async.waterfall([saveAssets, saveRecord, getIndex, updateIndex], (error) => {
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
      let deleteRecord = function(done) {
        userSession.putFile(`${Inflector.inflector.pluralize(type.modelName)}/${snapshot.id}`, '{}', {
          encrypt: false
        }).then(() => {
          done();
        }).catch((error) => {
          done(error);
        });
      }

      let getIndex = function(done) {
        getFile(store, `indices/${Inflector.inflector.pluralize(type.modelName)}`, (error, index) => {
          if (error || !index.data) {
            index = { data: [] };
          }

          done(error, index);
        });
      }

      let updateIndex = function(index, done) {
        index.data = index.data.filter((doc) => {
          return (doc) ? doc.data.id !== snapshot.id : false;
        });

        userSession.putFile(`indices/${Inflector.inflector.pluralize(type.modelName)}`, JSON.stringify(index), {
          encrypt: false
        }).then(() => {
          done();
        }).catch((error) => {
          console.error('Failed to updateIndex', error);
        });
      }

      async.waterfall([deleteRecord, getIndex, updateIndex], (error) => {
        if (error) {
          console.error('Failed to delete record', error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },

  findAll(store, type, uselistFiles) {
    return new Promise((resolve, reject) => {
      let getRecords = function(done) {
        let paths = [],
          promise;

        if (uselistFiles) {
          promise = userSession.listFiles((path) => {
            if (path.indexOf(Inflector.inflector.pluralize(type.modelName)) === 0) {
              paths.push(path);
            }

            return true;
          });

          promise.then(() => {
            done(null, paths);
          });
        } else {
          getFile(store, `indices/${Inflector.inflector.pluralize(type.modelName)}`, (error, index) => {
            done(null, index ? index.data : []);
          });
        }
      };

      async.waterfall([getRecords], (error, files) => {
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
