import Ember from 'ember';
import App from 'qumla/app';

export default Ember.Route.extend({
	question: null,
	session: Ember.inject.service(),
	model:function(params,transition){
		//var stat = this.store.query('answerStat',{question:transition.resolvedModels.question.get('id')});
		// used just for prototype
		var question = transition.resolvedModels.question.question;
		this.set('question',question);		

    let loadAdvancedDashboard = this.get('question.hasAdvancedDashboard') || this.get('session.isCustomer');

		var optionStatRaw = this.store.query('answerstatoption',{filter:{question:this.get('question.id')}});
    var countryList = this.store.findAll('country');

		var comments = this.commentsLoader();
		var votingarea=App.getData('/votingarea',true,"GET",true,false,{qid:question.id},null,null);
		var countryP=loadAdvancedDashboard?App.getData('/countryresult',true,"GET",true,false,{qid:question.id},null,null):null;
		var answerstathistory=App.getData('/answerstathistory',true,"GET",true,false,{qid:question.id,country:null},null,null);




		return Ember.RSVP.hash({
			optionStatRaw: optionStatRaw,
			question: question,
			comments: comments,
			countryResult:countryP,
			votingarea: votingarea,
			geolocation: transition.resolvedModels.question.geolocation,
			location: transition.resolvedModels.question.location,
			answerstathistory: answerstathistory,
      countryList: countryList
		});
	},
	setupController: function(controller, model) {
		if(model.votingarea.length===0 && model.question.get('status')!==50){
			this.transitionTo('question.detail');
		}
		controller.set('question', model.question);
		controller.set('optionStatRaw', model.optionStatRaw);
		controller.set('votingarea', model.votingarea);

		controller.set('comments', model.comments);	

		controller.set('countryData', model.countryResult);	
    controller.set('zoomCountry', null); 
    controller.set('regionData', null); 


		controller.set('region', '150');
		controller.set('location', model.location);
		controller.set('answerstathistoryRaw', model.answerstathistory);
    controller.set('countryList', model.countryList);

		
		if(model.geolocation && !model.geolocation.browserSupportFlag){
			controller.set('mylocation', model.geolocation);
		}else{
			var mylocation = new google.maps.LatLng(model.location.lat,model.location.lon);			
			controller.set('mylocation', mylocation);			
		}
  },
  	commentsLoader:function(){
  		return this.store.query('comment',{filter:{question:this.get('question.id')}});
  	},
  	actions:{
  		reloadHandler:function(modelName){
  			var loaderFunction=this.get(modelName+'Loader');
  			this.get('controller').set(modelName,loaderFunction.apply(this));
  		}
  	}
});
