import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export function initialize() {
  Controller.reopen({
    session: service()
  });
}

export default {
  initialize
};
