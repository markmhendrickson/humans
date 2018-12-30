'use strict';

require('park-ranger')();

module.exports = function(environment) {
  let ENV = {
    APP: {},
    environment,
    modulePrefix: 'humans',
    rootURL: '/',
    locationType: 'router-scroll',
    historySupportMiddleware: true,
    EmberENV: {
      FEATURES: {},
      EXTEND_PROTOTYPES: {
        Date: false
      }
    },
    host: {
      ipAddress: process.env.hostIpAddress,
      domain: process.env.hostDomain
    }
  };

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  return ENV;
};
