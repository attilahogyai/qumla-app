import Ember from 'ember';
import BaseValidator from 'ember-cp-validations/validators/base';
import App from "qumla/app";

export default BaseValidator.extend({
  store: Ember.inject.service(),

  validate(value, options, model, attribute) {
  	if(!value) return true;
  		let id=model.get('id') || 0;
		return App.getData("/common/check/email?email="+value+"&eId="+id,true,"GET",true,false,{}).then(function(result){
			if(result==='NULL') {
				return true;
			}else{
				return App.locX("/signup/alreadyexists");
			}
  	});
  }
});