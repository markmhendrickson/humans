import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

/**
 * Component adapted from https://github.com/KasperTidemann/ember-contenteditable-view/blob/master/ember-contenteditable-view.js
 */
export default Component.extend({
  attributeBindings: ['contenteditable', 'placeholder', 'spellcheck'],
  editable: false,
  isUserTyping: false,
  store: service(),

  contenteditable: computed(function() {
    return this.get('editable') ? 'true' : 'false';
  }),

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
      this.get('store').queueSave(this.get('model'));
    }
  },

  processValue: function() {
    if (!this.get('isUserTyping') && this.get('value')) {
      return this.setContent();
    }
  },

  setContent: function() {
    return this.$().html(Ember.Handlebars.Utils.escapeExpression(this.get('value')));
  },

  valueObserver: (function() {
    Ember.run.once(this, 'processValue');
  }).observes('value', 'isUserTyping')
});
