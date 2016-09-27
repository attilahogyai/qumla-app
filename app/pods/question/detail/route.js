import Ember from 'ember';

export default Ember.Route.extend({
	model:function(params,transition){
		return transition.resolvedModels.question.question;
	},
	setupController: function(controller, model) {
		if(model.get('answered') || model.get('status')===50){
			this.transitionTo('question.result');
		}
		controller.set('question', model);
  	}
});
