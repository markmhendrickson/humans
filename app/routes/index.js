import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (this.get('session.authenticated')) {
      this.set('headData.title', 'Edit profile');
    } else {
      this.get('headData').setDefaultTitle();
    }
  }
});
