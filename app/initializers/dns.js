import Ember from 'ember';
import config from 'humans/config/environment';

export function initialize(app) {
  if (!window) { return; }

  app.deferReadiness();

  Ember.$.getJSON(`https://dns.google.com/resolve?name=${window.location.origin}&type=TXT`).then((data) => {
    if (data && data.Answer && data.Answer[0].data && data.Answer[0].data.indexOf('blockstack=') === 1) {
      config.blockstackName = data.Answer[0].data.replace(/"/g, '').substr(11);
    }

    app.advanceReadiness();
  });
}

export default {
  initialize
};
