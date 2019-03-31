import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export function initialize() {
  Route.reopen({
    headData: service(),
    nav: service(),
    router: service(),
    session: service(),

    init() {
      this._super.apply(this, arguments);

      this.router.on('routeWillChange', (transition) => {
        this.get('headData').clear();
      })
    }
  });
}

export default {
  initialize
};
