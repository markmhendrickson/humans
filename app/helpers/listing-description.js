import Ember from 'ember';

export default Ember.Helper.extend({
  intl: Ember.inject.service(),

  compute([listing], options) {
    if (listing && listing.get('description') && (!options.property || options.property === 'description')) {
      return listing.get('description');
    } else if (listing.get('publication') && (!options.property || options.property === 'publication')) {
      return listing.get('publication');
    } else if (listing.get('publishedAt') && (!options.property || options.property === 'publishedAt')) {
      return this.get('intl').formatDate(listing.get('publishedAt'), { day: 'numeric', month: 'long', year: 'numeric' });
    } else if (listing.get('createdAt') && (!options.property || options.property === 'createdAt')) {
      return this.get('intl').formatDate(listing.get('createdAt'), { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
});
