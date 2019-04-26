import $ from 'jquery';
import config from 'humans/config/environment';

export function initialize(app) {
  if (!window || !window.location || window.location.hostname === config.location.hostname) { return; }

  app.deferReadiness();

  $.getJSON(`https://dns.google.com/resolve?name=${window.location.hostname}&type=TXT`).then((data) => {
    if (data && data.Answer && data.Answer[0].data && data.Answer[0].data.indexOf('blockstack=') === 1) {
      config.blockstackName = data.Answer[0].data.replace(/"/g, '').substr(11);
    }

    app.advanceReadiness();
  });
}

export default {
  initialize
};
