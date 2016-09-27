import Ember from 'ember';

export function initialize(container, application) {
	application.deferReadiness();
  Ember.$.ajaxSetup({async:false});
  Ember.$.getJSON("/api/common/langtext", function(langtext) {
    for(var i=0;i<langtext.length;i++){
      var item=langtext[i];
      var c='/'+item['type']+'/'+item['code']+'/'+item['language'];
      Ember.STRINGS[c]=item['text'];
    }
  });
  Ember.Logger.info('INIT Language DONE');
  Ember.$.ajaxSetup({async:true});
  application.advanceReadiness();
}

export default {
  before: 'store',
  name: 'language-init',
  initialize: initialize
}; 