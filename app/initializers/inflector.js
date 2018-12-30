import Inflector from 'ember-inflector';

export function initialize() {
  Inflector.inflector = new Inflector({
    irregularPairs: [
      ['human', 'humans']
    ]
  });
}

export default {
  initialize
};
