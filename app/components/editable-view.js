import Component from '@ember/component';
import Ember from 'ember';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import { once } from '@ember/runloop';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import showdown from 'showdown';
import striptags from 'striptags';

let converter = new showdown.Converter();

/**
 * Component adapted from https://github.com/KasperTidemann/ember-contenteditable-view/blob/master/ember-contenteditable-view.js
 */
export default Component.extend({
  attributeBindings: ['contenteditable', 'dataText:data-text', 'placeholder', 'spellcheck'],
  classNameBindings: ['className', 'editable:editable:notEditable'],

  contenteditable: computed('editable', function() {
    return this.get('editable');
  }),

  dataText: computed('placeholder', function() {
    return this.get('placeholder');
  }),

  didInsertElement: function() {
    if (this.get('richEditor')) {
      BalloonEditor.create(this.element, {
        toolbar: {
          items: [
            'heading',
            'bold',
            'italic',
            'bulletedList',
            'numberedList',
            'link'
          ]
        }
      }).then((editor) => {
        this.set('editor', editor);
        this.setHtml();
      }).catch(console.error);
    }

    this.setHtml();
  },

  init: function() {
    ['keyUp', 'focusOut', 'click'].forEach((action) => {
      this.set(action, this.setValue);
    });

    return this._super(arguments);
  },

  changeHtml: observer('editable', 'richEditor', function() {
    this.setHtml();
  }),

  setHtml() {
    if (this.get('richEditor') && this.get('editable')) {
      if (this.get('editor')) {
        this.get('editor').isReadOnly = false;
      }

      this.$().html(converter.makeHtml(this.get('value')));
    } else {
      if (this.get('editor')) {
        this.get('editor').isReadOnly = true;
      }

      this.$().html(this.get('value'));
    }
  },

  setValue() {
    let val;

    if (this.get('richEditor')) {
      val = converter.makeMarkdown(this.$().html()).trim();

      if (val.length === 0) {
        val = null;
      }
    } else {
      val = this.$().text();
    }

    this.set('value', val);
  }
});
