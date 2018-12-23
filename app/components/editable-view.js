import Component from '@ember/component';
import blockstack from 'npm:blockstack';

// Adapted from https://github.com/KasperTidemann/ember-contenteditable-view/blob/master/ember-contenteditable-view.js
export default Component.extend({
  attributeBindings: ['contenteditable', 'placeholder', 'spellcheck'],
  contenteditable: 'true',
  isUserTyping: false,

  // Processors:
  processValue: function() {
    if (!this.get('isUserTyping') && this.get('value')) {
      return this.setContent();
    }
  },

  // Observers:
  valueObserver: (function() {
    Ember.run.once(this, 'processValue');
  }).observes('value', 'isUserTyping'),

  // Events:
  didInsertElement: function() {
    return this.setContent();
  },

  focusOut: function() {
    return this.set('isUserTyping', false);
  },

  keyDown: function(event) {
    if (!event.metaKey) {
      return this.set('isUserTyping', true);
    }
  },

  keyUp: function(event) {
    this.set('value', this.$().text());

    if (this.get('model')) {
      this.get('model').save();
    }
  },

  setContent: function() {
    return this.$().html(Ember.Handlebars.Utils.escapeExpression(this.get('value')));
  }
});
