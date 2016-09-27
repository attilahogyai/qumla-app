import Ember from 'ember';
import QInfinityRoute from "qumla/util/q-infinity-route";
import ENV from 'qumla/config/environment';
export default QInfinityRoute.extend({
	model:function(params,transition){
		var questionPromise = null;
		if(params.querystring && params.querystring.length>0){
			questionPromise = this.infinityModel("question", { perPage: ENV.APP.perPage, startingPage: 1, filter:{query:params.querystring}});
		}
		return Ember.RSVP.hash({
			questions: questionPromise,
			querystring: params.querystring
		});
	},
	setupController: function(controller, model) {
		controller.set('questions', model.questions);
		controller.set('querystring', model.querystring);
  	}
});
