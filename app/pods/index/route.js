import Ember from 'ember';
import QInfinityRoute from "qumla/util/q-infinity-route";
import ENV from 'qumla/config/environment';
export default QInfinityRoute.extend({
  	appstate: Ember.inject.service(),

	model:function(){
		
		//var questionPromise=this.store.findAll('question');
		var questionPromise = this.infinityModel("question", { perPage: ENV.APP.perPage, startingPage: 1, filter:{popular:true}});
		var latestQuestionPromise = null;
		var comments = null;
		var tags = null;
		if(!this.get('appstate.isMobile')){
			latestQuestionPromise = this.store.query("question", { page:{limit:1,offset:1} , filter:{latest:true}});
			comments = this.store.query('comment',{filter:{recent:true}});
			tags = this.store.query('tag',{filter:{popular:true}});
		}


		return Ember.RSVP.hash({
			questions: questionPromise,
			comments: comments,
			tags: tags,
			latestQuestion: latestQuestionPromise
		});
	},
	setupController: function(controller, model) {
		controller.set('model', model.questions);
		controller.set('questions', model.questions);
		controller.set('comments', model.comments);
		controller.set('tags', model.tags);
		controller.set('latestQuestion', model.latestQuestion);
  	}
});
