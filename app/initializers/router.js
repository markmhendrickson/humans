import Route from '@ember/routing/route';
import Router from '@ember/routing/router';
import { inject as service } from '@ember/service';

export function initialize() {
  Route.reopen({
    headData: service(),
    nav: service(),
    session: service()
  });

  Router.reopen({
    headData: service(),

    willTransition() {
      this._super.apply(this, arguments);
      this.get('headData').clear();
    }
  });
}

export default {
  initialize
};
