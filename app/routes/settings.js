import AuthenticatedRoute from 'humans/routes/authenticated';

export default AuthenticatedRoute.extend({
  beforeModel() {
    this.set('headData.title', 'Settings');
  }
});
