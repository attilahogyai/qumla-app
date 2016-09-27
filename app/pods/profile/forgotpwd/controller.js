import Ember from 'ember';
import {
  validator, buildValidations
} from 'ember-cp-validations';
import App from 'qumla/app';

const Validations = buildValidations({
  email: [validator('presence', {presence:true, message:' '}), validator('format', { type: 'email' })],
});

export default Ember.Controller.extend(Validations,{
	email: null,
	session: Ember.inject.service(),
    modal: 	Ember.inject.service(),

	actions:{
		sendResetPasswordEmail: function(){
			var reset=App.getData('/forgot',true,'POST',true,false,{
				email:this.get('email'),
				l: this.get('session.language')
			},null,null);
			var c=this;
			this.get('loader').startLoadProcess(reset);
			reset.then(function(){
                c.get('modal').openInfoModal({header:'Password change request sent',text:App.locX('/forgot/requestsent')});
				c.transitionToRoute('profile.index');
			},function(){
                c.get('modal').openInfoModal({header:'Password change request error',text:App.locX('/forgot/requestsent_error')});				
			});
			
		}
	}
});
