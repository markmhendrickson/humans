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
    location: {
      hostname: process.env.HUMANS_HOSTNAME,
      ipAddress: process.env.HUMANS_IP_ADDRESS,
      port: process.env.HUMANS_PORT,
      protocol: process.env.HUMANS_PROTOCOL ? process.env.HUMANS_PROTOCOL : 'https'
    },
    segment: {
      defaultPageTrack: false,
      WRITE_KEY: process.env.HUMANS_SEGMENT_WRITE_KEY
    }
  };

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.location = {
      hostname: process.env.HUMANS_PRODUCTION_HOSTNAME,
      ipAddress: process.env.HUMANS_PRODUCTION_IP_ADDRESS,
      port: process.env.HUMANS_PRODUCTION_PORT,
      protocol: process.env.HUMANS_PRODUCTION_PROTOCOL ? process.env.HUMANS_PRODUCTION_PROTOCOL : 'https'
    }

    ENV.segment.WRITE_KEY = process.env.HUMANS_PRODUCTION_SEGMENT_WRITE_KEY;
  }

  return ENV;
};
