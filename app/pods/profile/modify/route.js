import Ember from 'ember';
export default Ember.Route.extend({
	session: Ember.inject.service(),
	model:function(params,transition){
		let userPromise; 
		if(this.get('session.userid')){
			userPromise = this.store.findRecord('user',this.get('session.userid'));	
		}else{
			userPromise = this.store.findRecord('user',0);				
		}
		return userPromise;	
	}
});
