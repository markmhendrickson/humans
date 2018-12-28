import Inflector from 'ember-inflector';

export function initialize(/* application */) {
  Inflector.inflector = new Inflector({
    irregularPairs: [
      ['human', 'humans']
    ]
  });
}

export default {
  initialize
};
