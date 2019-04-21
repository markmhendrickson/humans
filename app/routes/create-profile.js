import UnauthenticatedRoute from 'humans/routes/unauthenticated';

export default UnauthenticatedRoute.extend({
  afterModel() {
    this.set('headData.title', 'Create profile');
  }
});
