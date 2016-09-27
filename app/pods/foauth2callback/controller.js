import Ember from 'ember';
import App from "qumla/app";
export default Ember.Controller.extend({
	message:App.locX('/oauth/processing'),
	session: Ember.inject.service(),
	loader: Ember.inject.service(),
	done:false,
	checkUrl:function(){
		//return 'oauth2tokencheck';
		return '/foauth2tokencheck';
	},
	codeObserver:function(){
		if(this.get('model.authToken')!=null){
			var c=this;			
			var oauthPromise=App.getData(c.checkUrl()+'?code='+c.get('model.authToken'),true,'POST',true,false,{},null,null);
			this.get('loader').startLoadProcess(oauthPromise);
			oauthPromise.then(function(d){
				c.set('message',App.locX('/oauth/processing_done'));
				c.set('done',true);
				c.session.updateSessionModel(d);
				c.transitionToRoute('profile');
			});
			oauthPromise.fail(function(error){
				var status = (error.errors && error.errors[0].status) || error.status;
				if(status=='417'){
					Materialize.toast('<span style="font-size:1.2em;white-space:nowrap;max-width:800px;">Something went wrong with your session, reloading session in progress!<span>', 4000,"",function(){App.reload(true);});
				}
				c.set('message',App.locX('/oauth/processing_error'));
				c.set('done',false);
			});
		}
	}.observes('model.authToken').on('init')

});
