import Ember from 'ember';
import GeoLocationAware from 'qumla/mixins/geolocation-aware';
import App from 'qumla/app';

export default Ember.Route.extend(GeoLocationAware,{
	queryParams: {
    	t: {
      		refreshModel: true
    	}
  	},
	titleToken: 'Question detail',
	model:function(params, transition){
		let location = App.getData('/location',false,'GET',true,false,{});
		let question = (params.question_id>0)?this.store.findRecord('question',params.question_id,{ reload: true }):this.store.createRecord('question', {});
		//let geolocation = this.getGeoLocation();
		return Ember.RSVP.hash({
			question: question,
			location: location,
			geolocation: null
		});

	},
	setupController: function(controller, model) {
		this.set('titleToken',model.question.get('title'));

	    Ember.$("[data-og-url]").attr("content",'https://qumla.com/'+this.get('router').get('url'));    
	    Ember.$("[data-og-title]").attr("content",model.question.get('title'));    
	    Ember.$("[data-og-image-url]").attr("content","https://qumla.com/img/question/"+model.question.get('img'));    
	    Ember.$("[data-og-image]").attr("content","https://qumla.com/img/question/"+model.question.get('img'));    	    
	    Ember.$("[data-twitter-image]").attr("content","https://qumla.com/img/question/"+model.question.get('img'));    
	    Ember.$("[data-og-image-secure-url]").attr("content","https://qumla.com/img/question/"+model.question.get('img'));    	    
	    Ember.$("[data-og-description]").attr("content",model.question.get('description'));    	    
		controller.set('question', model.question);
		controller.set('location', model.location);
		controller.set('geolocation', model.geolocation);
  	}
});
