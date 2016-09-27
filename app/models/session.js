import Ember from 'ember';
import DS from 'ember-data';
var SessionModel=DS.Model.extend({
	token: DS.attr('string'),
	old_token: DS.attr('string'),
	scope: DS.attr('string'),
	username : DS.attr('string'),
	login : DS.attr('string'),
	userid : DS.attr('string'),
	image : DS.attr('boolean'),
	createDt: DS.attr('date'),
	modifyDt: DS.attr('datetime'),
	prevLogin: DS.attr('date'),
	language: DS.attr('string'),
	hash: DS.attr('string'),
	old_hash: DS.attr('string'),

	version:Ember.computed('modifyDt',function(){
		if(!Ember.isEmpty(this.get('modifyDt'))){
      		return this.get('modifyDt').format('YYMDHms');
    	}
    	return 1;
	}),
	isAdmin:Ember.computed('scope',function(){
		if(!this.get('scope')) return false;
		return this.get('scope').indexOf("ROLE_ADMIN")>=0;
	}),
	isCustomer:Ember.computed('scope',function(){
		if(!this.get('scope')) return false;
		return this.get('scope').indexOf("ROLE_CUSTOMER")>=0;
	}),
	isRegistered:Ember.computed('scope',function(){
		if(!this.get('scope')) return false;
		return this.get('scope').indexOf("ROLE_REGISTERED")>=0;
	})
});
export default SessionModel;