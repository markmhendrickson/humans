import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  date: computed('listing.{createdAt,publishedAt}', function() {
    if (this.get('listing.publishedAt')) {
      return this.get('listing.publishedAt');
    } else if (this.get('listing.createdAt')) {
      return this.get('listing.createdAt');
    }
  }),

  hasImage: computed('imageUrl', function() {
    return (this.get('imageUrl'));
  }),

  hasHeader: computed('header', function() {
    return (this.get('header'));
  }),

  header: computed('listing.{name,title}', function() {
    if (this.get('listing.name')) {
      return this.get('listing.name');
    } else if (this.get('listing.title')) {
      return this.get('listing.title');
    }
  }),

  imageUrl: computed('listing.{imageUrl,thumbImageUrl}', function() {
    if (this.get('listing.thumbImageUrl')) {
      return this.get('listing.thumbImageUrl');
    } else if (this.get('listing.imageUrl')) {
      return this.get('listing.imageUrl');
    }
  }),

  linkDescription: computed('hasHeader', 'linkListings', function() {
    return (!this.get('hasHeader') && this.get('linkListings'));
  }),

  linkListing: computed('hasContent', 'hasHeader', 'linkListings', function() {
    return ((this.get('hasHeader') || !this.get('hasContent')) && this.get('linkListings'));
  })
});
