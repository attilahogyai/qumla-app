import Ember from 'ember';
import QInfinityRoute from "qumla/util/q-infinity-route";
import ENV from 'qumla/config/environment';

export default QInfinityRoute.extend({
	titleToken: 'Hashtag ',

	model:function(params){
		var questionPromise;
		if(params.tag){
			questionPromise = this.infinityModel("question", { perPage: ENV.APP.perPage, startingPage: 1, filter:{tag:params.tag} });
		}
		var tags = this.store.query('tag',{filter:{popular:true}});
		return Ember.RSVP.hash({
			questions: questionPromise,
			tags: tags
		});		
	},
	setupController: function(controller, model) {
		this.set('titleToken','Hashtag - '+this.paramsFor('hashtag').tag);
		controller.set('questions', model.questions);
		controller.set('tags', model.tags);
		controller.set('tagName', this.paramsFor('hashtag').tag);
  	}	
});