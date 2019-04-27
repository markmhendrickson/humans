import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export function initialize() {
  Route.reopen({
    headData: service(),
    nav: service(),
    router: service(),
    session: service(),

    init() {
      this._super(...arguments)

      this.router.on('routeWillChange', () => {
        this.get('headData').clear();
      })
    }
  });
}

export default {
  initialize
};
