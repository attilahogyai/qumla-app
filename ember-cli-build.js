/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    /* foundation setup
    'ember-cli-foundation-sass': {
      'modernizr': false,
      'fastclick': true,
      'foundationJs': ['reveal','offcanvas','topbar']
    },
    compassOptions:{
      importPath:['bower_components/foundation/scss/']
    } 
    */    
    compassOptions:{
      importPath:['bower_components/materialize/sass/']
    },
    fingerprint: {
      exclude: ['images']
    }    

  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('bower_components/swiper/dist/css/swiper.min.css');  
  app.import('bower_components/moment/moment.js');
  app.import('vendor/awesomplete/awesomplete.js');    
  app.import('bower_components/ember-localstorage-adapter/localstorage_adapter.js');
  app.import('bower_components/materialize/dist/js/materialize.js');
  app.import('bower_components/chartist/dist/chartist.js');
  app.import('bower_components/swiper/dist/js/swiper.jquery.js');
  app.import('bower_components/fingerprintjs2/dist/fingerprint2.min.js');  
  return app.toTree();
};
