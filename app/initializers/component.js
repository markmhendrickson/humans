import Component from '@ember/component';
import { inject as service } from '@ember/service';

export function initialize() {
  Component.reopen({
    cookies: service(),
    headData: service(),
    nav: service(),
    session: service(),
    store: service()
  });
}

export default {
  initialize
};
