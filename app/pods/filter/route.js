import Ember from 'ember';
import QInfinityRoute from "qumla/util/q-infinity-route";
import ENV from 'qumla/config/environment';

export default QInfinityRoute.extend({
  	appstate: Ember.inject.service(),
	titleToken: 'Latest questions',
	model:function(params){
		var questionPromise;
		if(params.channel==='latest'){
			questionPromise = this.infinityModel("question", { perPage: ENV.APP.perPage, startingPage: 1, filter:{latest:true} });
		}
		var tags;
		if(!this.get('appstate.isMobile')){
			tags = this.store.query('tag',{filter:{popular:true}});
		}

		return Ember.RSVP.hash({
			questions: questionPromise,
			tags: tags
		});
	},
	setupController: function(controller, model) {
		controller.set('model', model.questions);		
		controller.set('questions', model.questions);
		controller.set('filterName', this.paramsFor('filter').channel);		
		controller.set('tags', model.tags);		

  	}	
});
