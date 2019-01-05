import UnauthenticatedRoute from 'humans/routes/unauthenticated';

export default UnauthenticatedRoute.extend({
  beforeModel() {
    this.set('headData.title', 'Create profile');
  }
});
