import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';
import capitalize from 'humans/utils/capitalize';
import Component from '@ember/component';

export default Component.extend({
  attributeBindings: ['id'],
  classNameBindings: [
    'carousel',
    'hideNoListings',
    'limit:limited',
    'listings.length:hasListings:hasNoListings',
    'pluralModelName'
  ],
  classNames: 'listings',
  listingLi: 'listing-li',
  tagName: 'section',

  actions: {
    error(error) {
      Ember.Logger.debug(error.message);
    }
  },

  header: computed('modelName', function() {
    return capitalize(pluralize(this.get('modelName')));
  }),

  id: computed('pluralModelName', function() {
    return this.get('pluralModelName');
  }),

  init() {
    this._super(...arguments);

    if (!this.get('listings')) {
      this.get('store').query(this.get('modelName'), {
        limit: this.get('limit'),
        sort: this.get('sort') ? this.get('sort') : '-createdAt'
      }).then((listings) => {
        this.set('listings', listings);
      }).catch((error) => {
        if (error) {
          console.error(error);
        }

        Ember.Logger.log(`${this.get('modelName')} listings-section initialized empty`);
      });
    }
  },

  pluralModelName: computed('modelName', function() {
    return this.get('modelName') ? pluralize(this.get('modelName')) : undefined;
  }),

  showViewAll: computed('limit', 'hideViewAll', function() {
    return (this.get('limit') && !this.get('hideViewAll'));
  }),

  viewAllLabel: computed('pluralModelName', function() {
    return `View all ${this.get('pluralModelName')}`;
  }),

  viewAllLink: computed('pluralModelName', function() {
    return this.get('pluralModelName');
  })
});
