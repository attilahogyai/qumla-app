import Ember from 'ember';
import App from 'qumla/app';
export default Ember.Route.extend({
	controller:null,
	modal: 	Ember.inject.service(),	
	clear:function(){
		this.get('controller').clear();
	}.on('deactivate'),
	model:function(params,transition){
		let languages=this.store.findAll('language');
		return Ember.RSVP.hash({
			question: transition.resolvedModels.question.question,
			mode: transition.params.question.question_text,
			languages: languages,
			location: transition.resolvedModels.question.location,
			mylocation: transition.resolvedModels.question.mylocation
		});
	},
	setupController: function(controller, model) {
		this.set('controller',controller);
		controller.init();
		controller.set('location', model.location);		
		controller.set('mylocation', model.mylocation);		

		controller.set('question', model.question);
		controller.set('mode', model.mode);
		controller.set('languages', model.languages.sortBy('name'));
		let defult=model.languages.filterBy('code',model.location.defLang);
		if(defult.length>0){
			controller.set('defaultLanguage',defult[0]);
		}
	},
	actions: {
	    willTransition: function(transition) {
	    	var self=this;
			if (this.controller.isDirty()) {
				this.get('modal').openConfirmModal({header:'Warning',
					text:App.locX('/question/cancel'),
					positiveCallback:function(){
						self.controller.clear();
						transition.retry();
					}});
	        	transition.abort();

	    	}
		}
	}
});
