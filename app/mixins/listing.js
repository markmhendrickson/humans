import Ember from 'ember';

export default Ember.Mixin.create({
  date: Ember.computed('listing.createdAt', 'listing.publishedAt', function() {
    if (this.get('listing.publishedAt')) {
      return this.get('listing.publishedAt');
    } else if (this.get('listing.createdAt')) {
      return this.get('listing.createdAt');
    }
  }),

  hasContent: Ember.computed('date', 'listing.{body,description}', 'header', function() {
    return ((this.get('date') || this.get('listing.description')) && (this.get('listing.body') || this.get('header')));
  }),

  hasImage: Ember.computed('imageUrl', function() {
    return (this.get('imageUrl'));
  }),

  hasHeader: Ember.computed('header', function() {
    return (this.get('header'));
  }),

  header: Ember.computed('listing.name', 'listing.title', function() {
    if (this.get('listing.name')) {
      return this.get('listing.name');
    } else if (this.get('listing.title')) {
      return this.get('listing.title');
    }
  }),

  imageUrl: Ember.computed('listing.imageUrl', 'listing.thumbImageUrl', function() {
    if (this.get('listing.thumbImageUrl')) {
      return this.get('listing.thumbImageUrl');
    } else if (this.get('listing.imageUrl')) {
      return this.get('listing.imageUrl');
    }
  }),

  linkDescription: Ember.computed('hasHeader', 'linkListings', function() {
    return (!this.get('hasHeader') && this.get('linkListings'));
  }),

  linkListing: Ember.computed('hasContent', 'hasHeader', 'linkListings', function() {
    return ((this.get('hasHeader') || !this.get('hasContent')) && this.get('linkListings'));
  })
});
