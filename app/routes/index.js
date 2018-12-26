import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  model() {
    if (this.get('session.authenticated')) {
      return this.get('session.human');
    }
  }
});
