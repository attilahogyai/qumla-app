/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'qumla',
    podModulePrefix: 'qumla/pods',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
	defaultLocationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      perPage: 5
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      'font-src': "'self' data: fonts.gstatic.com themes.googleusercontent.com",
      'style-src': "'self' 'unsafe-inline' fonts.googleapis.com ajax.googleapis.com www.google.com",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' use.typekit.net connect.facebook.net *.googleapis.com maps.gstatic.com www.google.com cdnjs.cloudflare.com www.gstatic.com s7.addthis.com m.addthis.com",
      'connect-src': "'self'",
      'img-src': "'self' data: www.facebook.com csi.gstatic.com maps.gstatic.com *.googleapis.com s7.addthis.com  secure.gravatar.com",
      'frame-src': "s-static.ak.facebook.com static.ak.facebook.com www.facebook.com s7.addthis.com",
      'media-src': "'self'" 
    }     
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'auto';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.locationType = 'auto'
  }

  return ENV;
};
