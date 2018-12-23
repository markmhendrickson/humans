import Ember from 'ember';

export function initialize(/* application */) {
  Ember.Inflector.inflector = new Ember.Inflector({
    irregularPairs: [
      ['human', 'humans']
    ]
  });
}

export default {
  initialize
};
