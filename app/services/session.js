import Service from '@ember/service';
import { computed } from '@ember/object';
import blockstack from 'npm:blockstack';

export default Service.extend({
  authenticated: computed(() => {
    return blockstack.isUserSignedIn();
  }),

  userData: computed(() => {
    return blockstack.loadUserData();
  })
});
