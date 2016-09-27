import Ember from 'ember';
import App from 'qumla/app';




export function initialize(instance) {
  var store=instance.container.lookup('service:store');
  var modal=instance.container.lookup('service:modal');

	App.session=instance.container.lookup('service:session');
	store.findAll('session').then(function(sessioRecords){
    if(sessioRecords.get('length')===0){ // request new session
      App.getData('/token',false,'POST',true,false,{},function(data) {
        if(data.access_token){

          var sessionInfo=store.createRecord('session',{});
          App.session.updateSessionModel(data, sessionInfo);

          sessionInfo.save().then(
          function (/*status*/){

            App.session.setup(sessionInfo);
            Ember.run.later(function(){
              new Fingerprint2().get(function(fingerprint){
                App.getData('/ping',true,'POST',false,false,{1:fingerprint},function(fp) {
                    // update session 
                    var oldToken=sessionInfo.get('token');
                    if(oldToken!==fp.access_token){
                      modal.openInfoModal({header:App.locX('/token/old_found_header'), text:App.locX('/token/old_found_text'),
                          action:function(){
                            App.session.updateSessionModel(fp).then(function(){
                              App.reload();      
                            });
                      }});
                    }
                });
              });              
            },2000);
          });
        }
      });

    }else{
      App.session.setup(sessioRecords.get('firstObject'));
      App.getData('/ping',true,'POST',false,false,{},function(data) {
        if(data!=="OK"){
          window.localStorage.clear();
          App.reload();
        }
      },function(status){
        if(parseInt(status.status)===403){ // token not found or expired
          Ember.Logger.debug('token expired request new');
          window.localStorage.clear();          
          App.reload();
        }
        
      });
    }
	});
}

export default {
  name: 'create-session',
  after: 'ember-data',    	
  initialize: initialize
};
