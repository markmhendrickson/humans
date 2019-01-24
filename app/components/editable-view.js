import Component from '@ember/component';
import Ember from 'ember';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { once } from '@ember/runloop';
import BalloonEditor from 'npm:@ckeditor/ckeditor5-build-balloon';
import showdown from 'npm:showdown';
import striptags from 'npm:striptags';

let converter = new showdown.Converter();

/**
 * Component adapted from https://github.com/KasperTidemann/ember-contenteditable-view/blob/master/ember-contenteditable-view.js
 */
export default Component.extend({
  attributeBindings: ['contenteditable', 'dataText:data-text', 'placeholder', 'spellcheck'],
  classNameBindings: ['empty'],
  store: service(),

  contenteditable: computed('editable', function() {
    return this.get('editable');
  }),

  dataText: computed('placeholder', function() {
    return this.get('placeholder');
  }),

  didInsertElement: function() {
    if (this.get('richEditor') && this.get('editable')) {
      BalloonEditor.create(this.element, {
        toolbar: {
          items: [
            'heading',
            'bold',
            'italic',
            'bulletedList',
            'numberedList'
          ]
        }
      }).catch(console.error);
    }

    this.$().html(this.get('richEditor') ? converter.makeHtml(this.get('value')) : this.get('value'));
  },

  init: function() {
    ['keyUp', 'focusOut', 'click'].forEach((action) => {
      this.set(action, this.setValue);
    });

    return this._super(arguments);
  },

  setValue() {
    let val;

    if (this.get('richEditor')) {
      val = striptags(converter.makeMarkdown(this.$().html())).trim();

      if (val.length === 0) {
        val = null;
      }
    } else {
      val = this.$().text();
    }

    this.set('value', val);
  }
});
