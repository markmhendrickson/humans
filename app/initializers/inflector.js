import Inflector from 'ember-inflector';

export function initialize() {
  Inflector.inflector = new Inflector({
    irregularPairs: [
      ['human', 'humans'],
      ['post', 'posts']
    ]
  });
}

export default {
  initialize
};
